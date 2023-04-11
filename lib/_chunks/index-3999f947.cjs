'use strict';

var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var sanity = require('sanity');
var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var ui = require('@sanity/ui');
var scrollIntoView = require('scroll-into-view-if-needed');
var suspendReact = require('suspend-react');
var useErrorBoundary = require('use-error-boundary');
var styled = require('styled-components');
function _interopDefaultCompat(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    default: e
  };
}
var scrollIntoView__default = /*#__PURE__*/_interopDefaultCompat(scrollIntoView);
var styled__default = /*#__PURE__*/_interopDefaultCompat(styled);
function isMuxInputProps(props) {
  var _a;
  return sanity.isObjectInputProps(props) && ((_a = props.schemaType.type) == null ? void 0 : _a.name) === "mux.video";
}
function isMuxInputPreviewProps(props) {
  var _a, _b;
  return ((_b = (_a = props.schemaType) == null ? void 0 : _a.type) == null ? void 0 : _b.name) === "mux.video";
}
const name = "mux-input";
const cacheNs = "sanity-plugin-mux-input";
const muxSecretsDocumentId = "secrets.mux";
function ErrorBoundaryCard(props) {
  const {
    children,
    schemaType
  } = props;
  const {
    push: pushToast
  } = ui.useToast();
  const errorRef = React.useRef(null);
  const {
    ErrorBoundary,
    didCatch,
    error,
    reset
  } = useErrorBoundary.useErrorBoundary({
    onDidCatch: (err, errorInfo) => {
      console.group(err.toString());
      console.groupCollapsed("console.error");
      console.error(err);
      console.groupEnd();
      if (err.stack) {
        console.groupCollapsed("error.stack");
        console.log(err.stack);
        console.groupEnd();
      }
      if (errorInfo == null ? void 0 : errorInfo.componentStack) {
        console.groupCollapsed("errorInfo.componentStack");
        console.log(errorInfo.componentStack);
        console.groupEnd();
      }
      console.groupEnd();
      pushToast({
        status: "error",
        title: "Plugin crashed",
        description: /* @__PURE__ */jsxRuntime.jsx(ui.Flex, {
          align: "center",
          children: /* @__PURE__ */jsxRuntime.jsxs(ui.Inline, {
            space: 1,
            children: ["An error happened while rendering", /* @__PURE__ */jsxRuntime.jsx(ui.Button, {
              padding: 1,
              fontSize: 1,
              style: {
                transform: "translateY(1px)"
              },
              mode: "ghost",
              text: schemaType.title,
              onClick: () => {
                if (errorRef.current) {
                  scrollIntoView__default.default(errorRef.current, {
                    behavior: "smooth",
                    scrollMode: "if-needed",
                    block: "center"
                  });
                }
              }
            })]
          })
        })
      });
    }
  });
  const handleRetry = React.useCallback(() => {
    suspendReact.clear([name]);
    reset();
  }, [reset]);
  if (didCatch) {
    return /* @__PURE__ */jsxRuntime.jsx(ui.Card, {
      ref: errorRef,
      paddingX: [2, 3, 4, 4],
      height: "fill",
      shadow: 1,
      overflow: "auto",
      children: /* @__PURE__ */jsxRuntime.jsx(ui.Flex, {
        justify: "flex-start",
        align: "center",
        height: "fill",
        children: /* @__PURE__ */jsxRuntime.jsxs(ui.Grid, {
          columns: 1,
          gap: [2, 3, 4, 4],
          children: [/* @__PURE__ */jsxRuntime.jsxs(ui.Heading, {
            as: "h1",
            children: ["The ", /* @__PURE__ */jsxRuntime.jsx("code", {
              children: name
            }), " plugin crashed"]
          }), (error == null ? void 0 : error.message) && /* @__PURE__ */jsxRuntime.jsx(ui.Card, {
            padding: 3,
            tone: "critical",
            shadow: 1,
            radius: 2,
            children: /* @__PURE__ */jsxRuntime.jsx(ui.Text, {
              children: error.message
            })
          }), /* @__PURE__ */jsxRuntime.jsx(ui.Inline, {
            children: /* @__PURE__ */jsxRuntime.jsx(ui.Button, {
              onClick: handleRetry,
              text: "Retry"
            })
          })]
        })
      })
    });
  }
  return /* @__PURE__ */jsxRuntime.jsx(ErrorBoundary, {
    children
  });
}
var ErrorBoundaryCard$1 = React.memo(ErrorBoundaryCard);
const AspectRatioCard = styled__default.default(ui.Card)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  aspect-ratio: 16 / 9;\n  position: relative;\n  width: 100%;\n"])));
const InputFallback = () => {
  return /* @__PURE__ */jsxRuntime.jsx("div", {
    style: {
      padding: 1
    },
    children: /* @__PURE__ */jsxRuntime.jsx(ui.Card, {
      shadow: 1,
      sizing: "border",
      style: {
        aspectRatio: "16/9",
        width: "100%",
        borderRadius: "1px"
      },
      children: /* @__PURE__ */jsxRuntime.jsxs(ui.Flex, {
        align: "center",
        direction: "column",
        height: "fill",
        justify: "center",
        children: [/* @__PURE__ */jsxRuntime.jsx(ui.Spinner, {
          muted: true
        }), /* @__PURE__ */jsxRuntime.jsx(ui.Box, {
          marginTop: 3,
          children: /* @__PURE__ */jsxRuntime.jsx(ui.Text, {
            align: "center",
            muted: true,
            size: 1,
            children: "Loading\u2026"
          })
        })]
      })
    })
  });
};
const Input = React.lazy(() => Promise.resolve().then(function () {
  return require('./Input-42aef09c.cjs');
}));
var createFormInput = config => React.memo(function FormInput(props) {
  if (isMuxInputProps(props)) {
    return /* @__PURE__ */jsxRuntime.jsx(AspectRatioCard, {
      children: /* @__PURE__ */jsxRuntime.jsx(ErrorBoundaryCard$1, {
        schemaType: props.schemaType,
        children: /* @__PURE__ */jsxRuntime.jsx(React.Suspense, {
          fallback: /* @__PURE__ */jsxRuntime.jsx(InputFallback, {}),
          children: /* @__PURE__ */jsxRuntime.jsx(Input, {
            config,
            ...props
          })
        })
      })
    });
  }
  return props.renderDefault(props);
});
const Preview = React.lazy(() => Promise.resolve().then(function () {
  return require('./Preview-22ff2e4a.cjs');
}));
var FormPreview = React.memo(function FormPreview(props) {
  if (isMuxInputPreviewProps(props)) {
    return /* @__PURE__ */jsxRuntime.jsx(AspectRatioCard, {
      children: /* @__PURE__ */jsxRuntime.jsx(Preview, {
        ...props
      })
    });
  }
  return props.renderDefault(props);
});
const defaultConfig = {
  mp4_support: "none"
};
const muxInput = sanity.definePlugin(userConfig => {
  const config = {
    ...defaultConfig,
    ...userConfig
  };
  const InputComponent = createFormInput(config);
  return {
    name: "mux-input",
    form: {
      components: {
        input: InputComponent,
        preview: FormPreview
      }
    },
    schema: {
      types: [{
        name: "mux.video",
        type: "object",
        title: "Video asset reference",
        fields: [{
          title: "Video",
          name: "asset",
          type: "reference",
          weak: true,
          to: [{
            type: "mux.videoAsset"
          }]
        }]
      }, {
        name: "mux.videoAsset",
        type: "object",
        title: "Video asset",
        fields: [{
          type: "string",
          name: "status"
        }, {
          type: "string",
          name: "assetId"
        }, {
          type: "string",
          name: "playbackId"
        }, {
          type: "string",
          name: "filename"
        }, {
          type: "number",
          name: "thumbTime"
        }]
      }]
    }
  };
});
exports.InputFallback = InputFallback;
exports.cacheNs = cacheNs;
exports.defaultConfig = defaultConfig;
exports.muxInput = muxInput;
exports.muxSecretsDocumentId = muxSecretsDocumentId;
//# sourceMappingURL=index-3999f947.cjs.map
