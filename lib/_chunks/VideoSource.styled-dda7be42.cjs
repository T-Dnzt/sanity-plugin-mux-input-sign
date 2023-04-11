'use strict';

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
var sanity = require('sanity');
var jsxRuntime = require('react/jsx-runtime');
var icons = require('@sanity/icons');
var ui = require('@sanity/ui');
var React = require('react');
var styled = require('styled-components');
var suspendReact = require('suspend-react');
var useErrorBoundary = require('use-error-boundary');
var index = require('./index-3999f947.cjs');
function _interopDefaultCompat(e) {
  return e && typeof e === 'object' && 'default' in e ? e : {
    default: e
  };
}
var styled__default = /*#__PURE__*/_interopDefaultCompat(styled);
const path = ["assetId", "data", "playbackId", "status", "thumbTime", "filename"];
const useAssetDocumentValues = asset => sanity.useDocumentValues(sanity.isReference(asset) ? asset._ref : "", path);
function useClient() {
  return sanity.useClient({
    apiVersion: "2022-09-14"
  });
}
const _id = "secrets.mux";
function readSecrets(client) {
  const {
    projectId,
    dataset
  } = client.config();
  return suspendReact.suspend(async () => {
    const data = await client.fetch( /* groq */"*[_id == $_id][0]{\n        token,\n        secretKey,\n        enableSignedUrls,\n        signingKeyId,\n        signingKeyPrivate\n      }", {
      _id
    });
    return {
      token: (data == null ? void 0 : data.token) || null,
      secretKey: (data == null ? void 0 : data.secretKey) || null,
      enableSignedUrls: Boolean(data == null ? void 0 : data.enableSignedUrls) || false,
      signingKeyId: (data == null ? void 0 : data.signingKeyId) || null,
      signingKeyPrivate: (data == null ? void 0 : data.signingKeyPrivate) || null
    };
  }, [index.cacheNs, _id, projectId, dataset]);
}
function generateJwt(client, playbackId, aud, payload) {
  const {
    signingKeyId,
    signingKeyPrivate
  } = readSecrets(client);
  if (!signingKeyId) {
    throw new TypeError("Missing signingKeyId");
  }
  if (!signingKeyPrivate) {
    throw new TypeError("Missing signingKeyPrivate");
  }
  const {
    default: sign
  } = suspendReact.suspend(() => import('jsonwebtoken-esm'), ["jsonwebtoken-esm"]);
  return sign(payload ? JSON.parse(JSON.stringify(payload, (_, v) => v != null ? v : void 0)) : {}, atob(signingKeyPrivate), {
    algorithm: "RS256",
    keyid: signingKeyId,
    audience: aud,
    subject: playbackId,
    noTimestamp: true,
    expiresIn: "12h"
  });
}
function getPlaybackId(asset) {
  if (!(asset == null ? void 0 : asset.playbackId)) {
    console.error("Asset is missing a playbackId", {
      asset
    });
    throw new TypeError("Missing playbackId");
  }
  return asset.playbackId;
}
function getPlaybackPolicy(asset) {
  var _a, _b, _c, _d;
  return (_d = (_c = (_b = (_a = asset.data) == null ? void 0 : _a.playback_ids) == null ? void 0 : _b[0]) == null ? void 0 : _c.policy) != null ? _d : "public";
}
function getAnimatedPosterSrc(_ref) {
  let {
    asset,
    client,
    height,
    width,
    start = asset.thumbTime ? Math.max(0, asset.thumbTime - 2.5) : 0,
    end = start + 5,
    fps = 15
  } = _ref;
  const params = {
    height,
    width,
    start,
    end,
    fps
  };
  const playbackId = getPlaybackId(asset);
  let searchParams = new URLSearchParams(JSON.parse(JSON.stringify(params, (_, v) => v != null ? v : void 0)));
  if (getPlaybackPolicy(asset) === "signed") {
    const token = generateJwt(client, playbackId, "g", params);
    searchParams = new URLSearchParams({
      token
    });
  }
  return "https://image.mux.com/".concat(playbackId, "/animated.gif?").concat(searchParams);
}
function getPosterSrc(_ref2) {
  let {
    asset,
    client,
    fit_mode,
    height,
    time = asset.thumbTime,
    width
  } = _ref2;
  const params = {
    fit_mode,
    height,
    time,
    width
  };
  const playbackId = getPlaybackId(asset);
  let searchParams = new URLSearchParams(JSON.parse(JSON.stringify(params, (_, v) => v != null ? v : void 0)));
  if (getPlaybackPolicy(asset) === "signed") {
    const token = generateJwt(client, playbackId, "t", params);
    searchParams = new URLSearchParams({
      token
    });
  }
  return "https://image.mux.com/".concat(playbackId, "/thumbnail.png?").concat(searchParams);
}
const mediaDimensions = {
  aspect: 16 / 9
};
const ImageLoader = React.memo(function ImageLoader2(_ref3) {
  let {
    alt,
    src,
    height,
    width,
    aspectRatio
  } = _ref3;
  suspendReact.suspend(async () => {
    const img = new Image(width, height);
    img.decoding = "async";
    img.src = src;
    await img.decode();
  }, ["sanity-plugin-mux-input", "image", src]);
  return /* @__PURE__ */jsxRuntime.jsx("img", {
    alt,
    src,
    height,
    width,
    style: {
      aspectRatio
    }
  });
});
const VideoMediaPreview = styled__default.default(sanity.MediaPreview)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  img {\n    object-fit: cover;\n  }\n"])));
const VideoMediaPreviewSignedSubtitle = _ref4 => {
  let {
    solo
  } = _ref4;
  return /* @__PURE__ */jsxRuntime.jsxs(ui.Inline, {
    space: 1,
    style: {
      marginTop: solo ? "-1.35em" : void 0,
      marginBottom: solo ? void 0 : "0.35rem"
    },
    children: [/* @__PURE__ */jsxRuntime.jsx(icons.LockIcon, {}), "Signed playback policy"]
  });
};
const PosterImage = _ref5 => {
  let {
    asset,
    height,
    width,
    showTip
  } = _ref5;
  const client = useClient();
  const src = getPosterSrc({
    asset,
    client,
    height,
    width,
    fit_mode: "smartcrop"
  });
  const subtitle = React.useMemo(() => showTip && getPlaybackPolicy(asset) === "signed" ? /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreviewSignedSubtitle, {
    solo: true
  }) : void 0, [asset, showTip]);
  return /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreview, {
    mediaDimensions,
    subtitle,
    title: /* @__PURE__ */jsxRuntime.jsx(jsxRuntime.Fragment, {
      children: null
    }),
    media: /* @__PURE__ */jsxRuntime.jsx(ImageLoader, {
      alt: "",
      src,
      height,
      width
    })
  });
};
const VideoThumbnail = React.memo(function VideoThumbnail2(_ref6) {
  let {
    asset,
    width,
    showTip
  } = _ref6;
  const {
    ErrorBoundary,
    didCatch,
    error
  } = useErrorBoundary.useErrorBoundary();
  const height = Math.round(width * 9 / 16);
  const subtitle = React.useMemo(() => showTip && getPlaybackPolicy(asset) === "signed" ? /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreviewSignedSubtitle, {}) : void 0, [showTip, asset]);
  if (didCatch) {
    return /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreview, {
      subtitle: error.message,
      mediaDimensions,
      title: "Error when loading thumbnail",
      media: /* @__PURE__ */jsxRuntime.jsx(ui.Card, {
        radius: 2,
        height: "fill",
        style: {
          position: "relative",
          width: "100%"
        },
        children: /* @__PURE__ */jsxRuntime.jsx(ui.Box, {
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          },
          children: /* @__PURE__ */jsxRuntime.jsx(icons.UnknownIcon, {})
        })
      })
    });
  }
  return /* @__PURE__ */jsxRuntime.jsx(ErrorBoundary, {
    children: /* @__PURE__ */jsxRuntime.jsx(React.Suspense, {
      fallback: /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreview, {
        isPlaceholder: true,
        title: "Loading thumbnail...",
        subtitle,
        mediaDimensions
      }),
      children: /* @__PURE__ */jsxRuntime.jsx(PosterImage, {
        showTip,
        asset,
        height,
        width
      })
    })
  });
});
const AnimatedVideoMediaPreview = styled__default.default(sanity.MediaPreview)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  img {\n    object-fit: contain;\n  }\n"])));
const AnimatedPosterImage = _ref7 => {
  let {
    asset,
    width
  } = _ref7;
  const client = useClient();
  const src = getAnimatedPosterSrc({
    asset,
    client,
    width
  });
  return /* @__PURE__ */jsxRuntime.jsx(AnimatedVideoMediaPreview, {
    withBorder: false,
    mediaDimensions,
    media: /* @__PURE__ */jsxRuntime.jsx(ImageLoader, {
      alt: "",
      src,
      width,
      aspectRatio: "16:9"
    })
  });
};
const AnimatedVideoThumbnail = React.memo(function AnimatedVideoThumbnail2(_ref8) {
  let {
    asset,
    width
  } = _ref8;
  const {
    ErrorBoundary,
    didCatch
  } = useErrorBoundary.useErrorBoundary();
  if (didCatch) {
    return null;
  }
  return /* @__PURE__ */jsxRuntime.jsx(ErrorBoundary, {
    children: /* @__PURE__ */jsxRuntime.jsx(React.Suspense, {
      fallback: /* @__PURE__ */jsxRuntime.jsx(FancyBackdrop, {
        children: /* @__PURE__ */jsxRuntime.jsx(VideoMediaPreview, {
          mediaDimensions,
          withBorder: false,
          media: /* @__PURE__ */jsxRuntime.jsx(ui.Spinner, {
            muted: true
          })
        })
      }),
      children: /* @__PURE__ */jsxRuntime.jsx(ui.Card, {
        height: "fill",
        tone: "transparent",
        children: /* @__PURE__ */jsxRuntime.jsx(AnimatedPosterImage, {
          asset,
          width
        })
      })
    })
  });
});
const FancyBackdrop = styled__default.default(ui.Box)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  backdrop-filter: blur(8px) brightness(0.5) saturate(2);\n  mix-blend-mode: color-dodge;\n"])));
const ThumbGrid = styled__default.default(ui.Grid)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n"])));
const CardLoadMore = styled__default.default(ui.Card)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  border-top: 1px solid var(--card-border-color);\n  position: sticky;\n  bottom: 0;\n  z-index: 200;\n"])));
exports.AnimatedVideoThumbnail = AnimatedVideoThumbnail;
exports.CardLoadMore = CardLoadMore;
exports.ThumbGrid = ThumbGrid;
exports.VideoThumbnail = VideoThumbnail;
exports._id = _id;
exports.generateJwt = generateJwt;
exports.getPlaybackId = getPlaybackId;
exports.getPlaybackPolicy = getPlaybackPolicy;
exports.getPosterSrc = getPosterSrc;
exports.useAssetDocumentValues = useAssetDocumentValues;
exports.useClient = useClient;
//# sourceMappingURL=VideoSource.styled-dda7be42.cjs.map
