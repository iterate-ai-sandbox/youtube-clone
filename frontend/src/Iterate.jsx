import React, { forwardRef } from "react";

function IterateWrapper(WrappedComponent, customAttributes) {
  // eslint-disable-next-line react/display-name
  return forwardRef((props, ref) => {
    // Combine the custom attributes with the props
    const combinedProps = {
      ...props,
      ...customAttributes,
      ref: ref,
    };

    // Return the wrapped component with the combined props
    return <WrappedComponent {...combinedProps} />;
  });
}

export default IterateWrapper;