var _templateObject;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
import { isObjectInputProps, definePlugin } from 'sanity';
import { jsx, jsxs } from 'react/jsx-runtime';
import { memo, useRef, useCallback, lazy, Suspense } from 'react';
import { useToast, Flex, Inline, Button, Card, Grid, Heading, Text, Spinner, Box } from '@sanity/ui';
import scrollIntoView from 'scroll-into-view-if-needed';
import { clear } from 'suspend-react';
import { useErrorBoundary } from 'use-error-boundary';
import styled from 'styled-components';
function isMuxInputProps(props) {
  var _a;
  return isObjectInputProps(props) && ((_a = props.schemaType.type) == null ? void 0 : _a.name) === "mux.video";
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
  } = useToast();
  const errorRef = useRef(null);
  const {
    ErrorBoundary,
    didCatch,
    error,
    reset
  } = useErrorBoundary({
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
        description: /* @__PURE__ */jsx(Flex, {
          align: "center",
          children: /* @__PURE__ */jsxs(Inline, {
            space: 1,
            children: ["An error happened while rendering", /* @__PURE__ */jsx(Button, {
              padding: 1,
              fontSize: 1,
              style: {
                transform: "translateY(1px)"
              },
              mode: "ghost",
              text: schemaType.title,
              onClick: () => {
                if (errorRef.current) {
                  scrollIntoView(errorRef.current, {
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
  const handleRetry = useCallback(() => {
    clear([name]);
    reset();
  }, [reset]);
  if (didCatch) {
    return /* @__PURE__ */jsx(Card, {
      ref: errorRef,
      paddingX: [2, 3, 4, 4],
      height: "fill",
      shadow: 1,
      overflow: "auto",
      children: /* @__PURE__ */jsx(Flex, {
        justify: "flex-start",
        align: "center",
        height: "fill",
        children: /* @__PURE__ */jsxs(Grid, {
          columns: 1,
          gap: [2, 3, 4, 4],
          children: [/* @__PURE__ */jsxs(Heading, {
            as: "h1",
            children: ["The ", /* @__PURE__ */jsx("code", {
              children: name
            }), " plugin crashed"]
          }), (error == null ? void 0 : error.message) && /* @__PURE__ */jsx(Card, {
            padding: 3,
            tone: "critical",
            shadow: 1,
            radius: 2,
            children: /* @__PURE__ */jsx(Text, {
              children: error.message
            })
          }), /* @__PURE__ */jsx(Inline, {
            children: /* @__PURE__ */jsx(Button, {
              onClick: handleRetry,
              text: "Retry"
            })
          })]
        })
      })
    });
  }
  return /* @__PURE__ */jsx(ErrorBoundary, {
    children
  });
}
var ErrorBoundaryCard$1 = memo(ErrorBoundaryCard);
const AspectRatioCard = styled(Card)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  aspect-ratio: 16 / 9;\n  position: relative;\n  width: 100%;\n"])));
const InputFallback = () => {
  return /* @__PURE__ */jsx("div", {
    style: {
      padding: 1
    },
    children: /* @__PURE__ */jsx(Card, {
      shadow: 1,
      sizing: "border",
      style: {
        aspectRatio: "16/9",
        width: "100%",
        borderRadius: "1px"
      },
      children: /* @__PURE__ */jsxs(Flex, {
        align: "center",
        direction: "column",
        height: "fill",
        justify: "center",
        children: [/* @__PURE__ */jsx(Spinner, {
          muted: true
        }), /* @__PURE__ */jsx(Box, {
          marginTop: 3,
          children: /* @__PURE__ */jsx(Text, {
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
const Input = lazy(() => import('./Input-1b053a16.js'));
var createFormInput = config => memo(function FormInput(props) {
  if (isMuxInputProps(props)) {
    return /* @__PURE__ */jsx(AspectRatioCard, {
      children: /* @__PURE__ */jsx(ErrorBoundaryCard$1, {
        schemaType: props.schemaType,
        children: /* @__PURE__ */jsx(Suspense, {
          fallback: /* @__PURE__ */jsx(InputFallback, {}),
          children: /* @__PURE__ */jsx(Input, {
            config,
            ...props
          })
        })
      })
    });
  }
  return props.renderDefault(props);
});
const Preview = lazy(() => import('./Preview-af721846.js'));
var FormPreview = memo(function FormPreview(props) {
  if (isMuxInputPreviewProps(props)) {
    return /* @__PURE__ */jsx(AspectRatioCard, {
      children: /* @__PURE__ */jsx(Preview, {
        ...props
      })
    });
  }
  return props.renderDefault(props);
});
const defaultConfig = {
  mp4_support: "none"
};
const muxInput = definePlugin(userConfig => {
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
export { InputFallback, cacheNs, defaultConfig, muxInput, muxSecretsDocumentId };
//# sourceMappingURL=index-376871b4.js.map
