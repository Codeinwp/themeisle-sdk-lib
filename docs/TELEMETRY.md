# Telemetry Module

> The telemetry module help up to observe the usage of our features.

The products that allow telemetry will load a special script used for registering events and a global object with settings.

To load the telemetry module you need to add this to the project: `add_filter( 'themeisle_sdk_enable_telemetry', '__return_true' );`. This command will make the SDK to load the telemetry script into the page.

> [!NOTE]  
> If multiple products are available, only the product with latest SDK will do the loading of the script.

The script will create another global object named `tiTrk` that can be used to track events. Also, you can create an alias like `oTrk = tiTrk.with('otter')` which make a small wrapper that adds `otter` as a product slug to all event created from it.

## Example of usage:

### `add` function

```javascript
window.oTrk?.add({
  feature: "stripe-checkout",
  featureComponent: "price-changed",
});
```

This will record that the user has changed the price into a Stripe Checkout block. This will indicate the usage of a feature.

To not create too many events, the `add` uses the object hash as the key. In the above example, the next calls of the function will not be registered since we already have it, and we are not interested in how many times the user did it. The checking it at the local scope. `tiTrk` is an event accumulator; once the limit has been reached or the user exits the page, the events from the buffer will be sent.

It will be something like this:

```javascript
// First Call
window.oTrk?.add({
  feature: "stripe-checkout",
  featureComponent: "price-changed",
}); // Registered.

// Second Call
window.oTrk?.add({
  feature: "stripe-checkout",
  featureComponent: "price-changed",
}); // Ignored.
```

Another example with `add` is this:

```javascript
window.oTrk?.add({
  feature: "marketing",
  featureComponent: "api-key",
  groupID: attributes.id,
});
```

This will register the action at the individual level. In the example above, the `groupID` is used to track the evolution of a Gutenberg block made with Otter. You can also put the page url to track features at page level and it is evolution.

As a whole, `groupID` allows us to observe the evolution of a feature values. Like when users switch to other vendors (Mailchimp to Sendinblue).

```javascript
window.oTrk?.add({
  feature: "marketing",
  featureComponent: "api-key",
  groupID: "form-1",
}); // Registered.

window.oTrk?.add({
  feature: "marketing",
  featureComponent: "api-key",
  groupID: "form-2",
}); // Registered.

window.oTrk?.add({
  feature: "marketing",
  featureComponent: "api-key",
  groupID: "form-1",
}); // Ignored.
```

_So `add` will register a unique event in the page session or events that we do not care about how many times they were accessed._

So this method is used to collect data that answer to the questions like: _Did the user used this?_

### `set` function

The set function solves the problem of component that requires user input. Things like text input, choices, etc.

When we register the event, we care about the final state of the input value. We do not care about typing process, etc.

```javascript
window.oTrk?.set(`${attributes.id}_size`, {
  feature: "form-file",
  featureComponent: "file-size",
  featureValue: maxFileSize,
  groupID: attributes.id,
});
```

In the above case, we override the event with id `${attributes.id}_size` each type the user types in the Text Component and register the value of the max file size inside the Form File Input. This will help us to see if our users use huge files with our form; if yes, then we can improve the process.

So this method is used to collect data that answer to the questions like: _What was the value used for this setting/feature?_

ℹ️ Under the hood `add` function uses the `set` function, and the key is the object hash.

### Global settings.

The SDK will load a global object named `tiTelemetry`:

```javascript
{
    "products": [
        {
            "slug": "neve",
            "trackHash": "free",
            "consent": true
        },
        {
            "slug": "otter",
            "consent": false,
            "trackHash": "8a224e33bb0b1c6a65df8be2960e6ef2"
        }
    ],
    "endpoint": "http://localhost:3000/bulk-tracking"
}
```

> [!IMPORTANT]  
> There are some cases when products inherit the license from other products. This can be handled with the `'themeisle_sdk_telemetry_products'` hook which change the `tiTelemetry`. [Example](https://github.com/Codeinwp/otter-blocks/blob/fa0295a962f70f1bb9cb83bbbf539402c64bea49/otter-blocks.php#L77-L105).

In the above example, we have the consent to track the Neve user, which is a Free user. For Otter, we have a Pro user identified by its hash which is derived from the license using `wp_hash`. This one did not allow consent, so we will reject every event for that product if the exception is not explicit.

Example with explicit consent:

```javascript
window.oTrk?.add(
  {
    feature: "ai-generation",
    featureComponent: "ai-toolbar",
    featureValue: actionKey,
  },
  { consent: true }
);
```

Since in AI Block, we are allowed to track, we can bypass the consent and register which type of action the user used in the AI Toolbar for Paragraph.

## Other

Otter implementation: https://github.com/Codeinwp/otter-blocks/pull/1919
Neve implementation: https://github.com/Codeinwp/neve/pull/4131

> [!IMPORTANT]  
> The tracking on the PHP side is a part of the products and not the SDK.
