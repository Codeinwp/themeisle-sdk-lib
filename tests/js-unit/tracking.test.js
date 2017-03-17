import { EventTrackingAccumulator } from '../../assets/js/src/tracking';


// Mock the global fetch function
global.fetch = jest.fn( () =>
	Promise.resolve({
		ok: true,
		json: () => Promise.resolve({ success: true })
	})
);

// Mock objects
const tiTelemetry = {
	endpoint: 'https://api.test.com/tracking',
	products: [
		{ slug: 'test-product', trackHash: 'abc123', consent: true }
	]
};

describe( 'EventTrackingAccumulator', () => {
	let accumulator;

	beforeEach( () => {
		accumulator = new EventTrackingAccumulator( tiTelemetry );
		global.fetch.mockClear();
	});

	test( 'should add an event to the accumulator using _add method', () => {
		const data = { slug: 'test-product', action: 'block-created' };
		const hash = accumulator._add( data );
		expect( accumulator.events.size ).toBe( 1 );
		expect( accumulator.events.get( hash ) ).toEqual( expect.objectContaining( data ) );
	});

	test( 'should set an event with a specific key using _set method', () => {
		const key = 'test-key';
		const data = { slug: 'test-product', action: 'block-updated' };
		accumulator._set( key, data );
		expect( accumulator.events.size ).toBe( 1 );
		expect( accumulator.events.get( key ) ).toEqual( expect.objectContaining( data ) );
	});

	test( 'should send events to the server', async() => {
		accumulator._add({ slug: 'test-product', action: 'block-created' });
		accumulator._add({ slug: 'test-product', action: 'block-updated' });

		await accumulator.uploadEvents();

		expect( global.fetch ).toHaveBeenCalledTimes( 1 );
		expect( global.fetch ).toHaveBeenCalledWith(
			'https://api.test.com/tracking',
			expect.objectContaining({
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: expect.any( String )
			})
		);
		expect( accumulator.events.size ).toBe( 0 );
	});

	test( 'should send events when limit is reached', async() => {
		for ( let i = 0; i < accumulator.eventsLimit; i++ ) {
			accumulator._add({ slug: 'test-product', action: `action-${i}` });
		}

		await accumulator.sendIfLimitReached();

		expect( global.fetch ).toHaveBeenCalledTimes( 1 );
		expect( accumulator.events.size ).toBe( 0 );
	});

	test( 'should create a new accumulator with preset data', () => {
		const withAccumulator = accumulator.with( 'test-product' );
		const data = { action: 'block-created' };
		withAccumulator.add( data );

		expect( accumulator.events.size ).toBe( 1 );
		const addedEvent = Array.from( accumulator.events.values() )[0];
		expect( addedEvent ).toEqual( expect.objectContaining({
			slug: 'test-product',
			action: 'block-created',
			license: 'abc123',
			env: 'post-editor'
		}) );
	});

	test( 'should return the correct consent value', () => {
		expect( accumulator.hasConsent() ).toBe( false );
		accumulator.consent = true;
		expect( accumulator.hasConsent() ).toBe( true );
	});

	test( 'should correctly validate tracking data', () => {
		expect( accumulator.validate({}) ).toBe( false );
		expect( accumulator.validate({ prop: undefined }) ).toBe( false );
		expect( accumulator.validate({ prop: 'value' }) ).toBe( true );
		expect( accumulator.validate({ prop1: 'value1', prop2: { nestedProp: 'value2' }}) ).toBe( true );
	});
});
