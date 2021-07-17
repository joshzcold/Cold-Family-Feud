import { useTranslation } from "react-i18next";
import "../i18n/i18n";

export default function TitleLogo(props) {
  const { t } = useTranslation();
  // don't recalculate offset if already set
  let logo = `
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:xlink="http://www.w3.org/1999/xlink"
   viewBox="0 0 507.285 324.08613"
   version="1.1"
   id="svg72">
  <metadata
     id="metadata76">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
        <dc:title></dc:title>
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <defs
     id="defs22">
    <linearGradient
       id="c">
      <stop
         offset="0"
         stop-color="#ff6603"
         id="stop2" />
      <stop
         offset="1"
         stop-color="#ffd0b2"
         id="stop4" />
    </linearGradient>
    <linearGradient
       id="a">
      <stop
         offset="0"
         stop-color="#039"
         id="stop7" />
      <stop
         offset="1"
         stop-color="#3669ff"
         id="stop9" />
    </linearGradient>
    <linearGradient
       id="b">
      <stop
         offset="0"
         stop-color="#f60"
         id="stop12" />
      <stop
         offset="1"
         stop-color="#ffeb00"
         id="stop14" />
    </linearGradient>
    <linearGradient
       xlink:href="#a"
       id="d"
       x1="119.818"
       y1="182.24699"
       x2="96.176003"
       y2="80.245003"
       gradientUnits="userSpaceOnUse" />
    <linearGradient
       xlink:href="#c"
       id="e"
       x1="161.01601"
       y1="131.42599"
       x2="248.19501"
       y2="82.411003"
       gradientUnits="userSpaceOnUse" />
    <linearGradient
       xlink:href="#b"
       id="h"
       x1="21.422001"
       y1="208.444"
       x2="19.037001"
       y2="186.57001"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1.61884,0,0,1.61884,131.41479,-120.91377)" />
    <linearGradient
       xlink:href="#b"
       id="f"
       x1="15.48"
       y1="124.966"
       x2="14.362"
       y2="102.054"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1.61884,0,0,1.61884,131.41479,-120.91377)" />
    <linearGradient
       xlink:href="#b"
       id="g"
       x1="87.878998"
       y1="149.31"
       x2="86.325996"
       y2="126.858"
       gradientUnits="userSpaceOnUse"
       gradientTransform="matrix(1.61884,0,0,1.61884,27.753445,-95.242264)" />
  </defs>
  <g
     id="g120"
     transform="translate(84.547506,108.0287)">
    <g
       transform="translate(63.490999,-44.629822)"
       stroke-linejoin="round"
       stroke-dashoffset="1.457"
       paint-order="stroke fill markers"
       id="g30">
      <ellipse
         cx="105.604"
         cy="151.672"
         rx="168.745"
         ry="95.946999"
         fill="url(#d)"
         stroke="#000000"
         stroke-width="0.7"
         id="ellipse24"
         style="fill:url(#d)" />
      <ellipse
         cx="104.889"
         cy="151.70599"
         rx="150.55701"
         ry="85.606003"
         fill="none"
         stroke="url(#e)"
         stroke-width="8.307"
         id="ellipse26"
         style="stroke:url(#e)" />
      <ellipse
         cx="102.357"
         cy="151.52499"
         rx="135.53101"
         ry="77.061996"
         fill="none"
         stroke="#ffffff"
         stroke-width="3.656"
         id="ellipse28" />
    </g>
    <g
       fill="#404040"
       id="g52"
       transform="translate(-2.3250272e-6,-2.2138205)">
      <text
         y="-26.431999"
         x="22.202"
         transform="matrix(1.6142471,-0.12185752,0.12185752,1.6142471,125.38521,-126.53744)"
         id="text36"><tspan
           x="17.681999"
           y="124.146"
           id="tspan34"><tspan
             style="-inkscape-font-specification:'C059 Bold';text-align:center"
             font-weight="700"
             font-size="50.8px"
             font-family="C059"
             text-anchor="middle"
             stroke-width="0.7"
             stroke-linejoin="round"
             id="tspan32">${props.insert}</tspan></tspan></text>
      <text
         transform="matrix(1.6142471,-0.12185752,0.12185752,1.6142471,23.950379,-93.135778)"
         x="89.712997"
         id="text42"><tspan
           style="-inkscape-font-specification:'C059 Bold'"
           y="150.578"
           x="78.793999"
           font-weight="700"
           font-family="C059"
           id="tspan40"><tspan
             style="-inkscape-font-specification:'C059 Bold';text-align:center"
             font-size="50.8px"
             text-anchor="middle"
             stroke-width="0.7"
             stroke-linejoin="round"
             id="tspan38">${t("family")}</tspan></tspan></text>
      <text
         y="59.118999"
         x="22.659"
         transform="matrix(1.6142471,-0.12185752,0.12185752,1.6142471,125.38521,-126.53744)"
         id="text50"><tspan
           style="-inkscape-font-specification:'C059 Bold'"
           y="209.696"
           x="13.11"
           font-weight="700"
           font-family="C059"
           id="tspan48"><tspan
             style="-inkscape-font-specification:'C059 Bold';text-align:center"
             font-size="50.8px"
             text-anchor="middle"
             stroke-width="0.7"
             stroke-linejoin="round"
             id="tspan46"><tspan
               style="-inkscape-font-specification:'C059 Bold'"
               id="tspan44">${t("feud")}</tspan></tspan></tspan></text>
    </g>
    <text
       x="167.35628"
       y="-163.70294"
       fill="url(#f)"
       transform="rotate(-4.3169998)"
       id="text58"
       style="font-size:19.4261px;fill:url(#f);stroke-width:1.61884"><tspan
         style="-inkscape-font-specification:'C059 Bold';fill:url(#f);stroke-width:2.62064"
         y="80.058754"
         x="160.03912"
         font-weight="700"
         font-family="C059"
         id="tspan56"><tspan
           style="-inkscape-font-specification:'C059 Bold';text-align:center;fill:url(#f)"
           font-size="82.2371px"
           text-anchor="middle"
           stroke="#000000"
           stroke-width="1.13319"
           stroke-linejoin="round"
           id="tspan54">${props.insert}</tspan></tspan></text>
    <text
       x="172.98444"
       transform="rotate(-4.3169998)"
       fill="url(#g)"
       id="text64"
       style="font-size:19.4261px;fill:url(#g);stroke-width:1.61884"
       y="-95.242256"><tspan
         style="-inkscape-font-specification:'C059 Bold';fill:url(#g);stroke-width:2.62064"
         y="148.51942"
         x="155.30832"
         font-weight="700"
         font-family="C059"
         id="tspan62"><tspan
           style="-inkscape-font-specification:'C059 Bold';text-align:center;fill:url(#g)"
           font-size="82.2371px"
           text-anchor="middle"
           stroke="#000000"
           stroke-width="1.13319"
           stroke-linejoin="round"
           id="tspan60">${t("family")}</tspan></tspan></text>
    <text
       y="-25.209562"
       x="168.09608"
       fill="url(#h)"
       stroke="#000000"
       transform="rotate(-4.3169998)"
       id="text70"
       style="font-size:19.4261px;fill:url(#h);stroke-width:1.61884"><tspan
         style="-inkscape-font-specification:'C059 Bold';fill:url(#h);stroke-width:2.62064"
         y="218.55051"
         x="152.63779"
         font-weight="700"
         font-family="C059"
         id="tspan68"><tspan
           style="-inkscape-font-specification:'C059 Bold';text-align:center;fill:url(#h)"
           font-size="82.2371px"
           text-anchor="middle"
           stroke-width="1.13319"
           stroke-linejoin="round"
           id="tspan66">${t("feud")}</tspan></tspan></text>
  </g>
</svg>
  `;
  return <div dangerouslySetInnerHTML={{ __html: logo }} />;
}
