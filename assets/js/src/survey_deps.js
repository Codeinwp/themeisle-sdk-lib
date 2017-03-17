import formbricks from "@formbricks/js/app";

/**
 * Load the formbricks library and expose it to the global scope.
 * Emit a custom event to let other scripts know that formbricks is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
    window.tsdk_formbricks = {
        init: (args) => {
            if ( typeof args.attributes === 'object' ) {
                args.attributes = {
                    ...window.tsdk_survey_attrs,
                    ...args.attributes
                }
            }
            
            formbricks?.init(args)
        }
    };
 
    window.dispatchEvent(new Event("themeisle:survey:loaded"));
});
