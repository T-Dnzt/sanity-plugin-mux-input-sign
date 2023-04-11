var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;
function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }
import { useDocumentValues, isReference, useClient as useClient$1, MediaPreview } from 'sanity';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { UnknownIcon, LockIcon } from '@sanity/icons';
import { Card, Box, Spinner, Grid, Inline } from '@sanity/ui';
import { memo, useMemo, Suspense } from 'react';
import styled from 'styled-components';
import { suspend } from 'suspend-react';
import { useErrorBoundary } from 'use-error-boundary';
import { cacheNs } from './index-376871b4.js';
const path = ["assetId", "data", "playbackId", "status", "thumbTime", "filename"];
const useAssetDocumentValues = asset => useDocumentValues(isReference(asset) ? asset._ref : "", path);
function useClient() {
  return useClient$1({
    apiVersion: "2022-09-14"
  });
}
const _id = "secrets.mux";
function readSecrets(client) {
  const {
    projectId,
    dataset
  } = client.config();
  return suspend(async () => {
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
  }, [cacheNs, _id, projectId, dataset]);
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
  } = suspend(() => import('jsonwebtoken-esm'), ["jsonwebtoken-esm"]);
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
const ImageLoader = memo(function ImageLoader2(_ref3) {
  let {
    alt,
    src,
    height,
    width,
    aspectRatio
  } = _ref3;
  suspend(async () => {
    const img = new Image(width, height);
    img.decoding = "async";
    img.src = src;
    await img.decode();
  }, ["sanity-plugin-mux-input", "image", src]);
  return /* @__PURE__ */jsx("img", {
    alt,
    src,
    height,
    width,
    style: {
      aspectRatio
    }
  });
});
const VideoMediaPreview = styled(MediaPreview)(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  img {\n    object-fit: cover;\n  }\n"])));
const VideoMediaPreviewSignedSubtitle = _ref4 => {
  let {
    solo
  } = _ref4;
  return /* @__PURE__ */jsxs(Inline, {
    space: 1,
    style: {
      marginTop: solo ? "-1.35em" : void 0,
      marginBottom: solo ? void 0 : "0.35rem"
    },
    children: [/* @__PURE__ */jsx(LockIcon, {}), "Signed playback policy"]
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
  const subtitle = useMemo(() => showTip && getPlaybackPolicy(asset) === "signed" ? /* @__PURE__ */jsx(VideoMediaPreviewSignedSubtitle, {
    solo: true
  }) : void 0, [asset, showTip]);
  return /* @__PURE__ */jsx(VideoMediaPreview, {
    mediaDimensions,
    subtitle,
    title: /* @__PURE__ */jsx(Fragment, {
      children: null
    }),
    media: /* @__PURE__ */jsx(ImageLoader, {
      alt: "",
      src,
      height,
      width
    })
  });
};
const VideoThumbnail = memo(function VideoThumbnail2(_ref6) {
  let {
    asset,
    width,
    showTip
  } = _ref6;
  const {
    ErrorBoundary,
    didCatch,
    error
  } = useErrorBoundary();
  const height = Math.round(width * 9 / 16);
  const subtitle = useMemo(() => showTip && getPlaybackPolicy(asset) === "signed" ? /* @__PURE__ */jsx(VideoMediaPreviewSignedSubtitle, {}) : void 0, [showTip, asset]);
  if (didCatch) {
    return /* @__PURE__ */jsx(VideoMediaPreview, {
      subtitle: error.message,
      mediaDimensions,
      title: "Error when loading thumbnail",
      media: /* @__PURE__ */jsx(Card, {
        radius: 2,
        height: "fill",
        style: {
          position: "relative",
          width: "100%"
        },
        children: /* @__PURE__ */jsx(Box, {
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
          children: /* @__PURE__ */jsx(UnknownIcon, {})
        })
      })
    });
  }
  return /* @__PURE__ */jsx(ErrorBoundary, {
    children: /* @__PURE__ */jsx(Suspense, {
      fallback: /* @__PURE__ */jsx(VideoMediaPreview, {
        isPlaceholder: true,
        title: "Loading thumbnail...",
        subtitle,
        mediaDimensions
      }),
      children: /* @__PURE__ */jsx(PosterImage, {
        showTip,
        asset,
        height,
        width
      })
    })
  });
});
const AnimatedVideoMediaPreview = styled(MediaPreview)(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  img {\n    object-fit: contain;\n  }\n"])));
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
  return /* @__PURE__ */jsx(AnimatedVideoMediaPreview, {
    withBorder: false,
    mediaDimensions,
    media: /* @__PURE__ */jsx(ImageLoader, {
      alt: "",
      src,
      width,
      aspectRatio: "16:9"
    })
  });
};
const AnimatedVideoThumbnail = memo(function AnimatedVideoThumbnail2(_ref8) {
  let {
    asset,
    width
  } = _ref8;
  const {
    ErrorBoundary,
    didCatch
  } = useErrorBoundary();
  if (didCatch) {
    return null;
  }
  return /* @__PURE__ */jsx(ErrorBoundary, {
    children: /* @__PURE__ */jsx(Suspense, {
      fallback: /* @__PURE__ */jsx(FancyBackdrop, {
        children: /* @__PURE__ */jsx(VideoMediaPreview, {
          mediaDimensions,
          withBorder: false,
          media: /* @__PURE__ */jsx(Spinner, {
            muted: true
          })
        })
      }),
      children: /* @__PURE__ */jsx(Card, {
        height: "fill",
        tone: "transparent",
        children: /* @__PURE__ */jsx(AnimatedPosterImage, {
          asset,
          width
        })
      })
    })
  });
});
const FancyBackdrop = styled(Box)(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  backdrop-filter: blur(8px) brightness(0.5) saturate(2);\n  mix-blend-mode: color-dodge;\n"])));
const ThumbGrid = styled(Grid)(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n"])));
const CardLoadMore = styled(Card)(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  border-top: 1px solid var(--card-border-color);\n  position: sticky;\n  bottom: 0;\n  z-index: 200;\n"])));
export { AnimatedVideoThumbnail, CardLoadMore, ThumbGrid, VideoThumbnail, _id, generateJwt, getPlaybackId, getPlaybackPolicy, getPosterSrc, useAssetDocumentValues, useClient };
//# sourceMappingURL=VideoSource.styled-81ae8d6c.js.map
