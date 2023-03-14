import React, { Component, Fragment } from 'react';
import {
    Container,
    Card,
    Alert,
    Row,
    Col,
    ProgressBar,
    ProgressBarProps,
    ToggleButtonGroup,
    ToggleButton,
    Form,
    ListGroup,
    ListGroupItem
  } from "react-bootstrap";
import UserService from "../services/user.service";
import styled from "styled-components";

import "../assets/css/cropanalytics.css";
import cropTimelineImg from "../assets/img/cropTimeline.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faMap } from "@fortawesome/free-solid-svg-icons";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

var leafSVGPath = "M44.142,24.938c9.279,19.309,9.176,42.223-0.321,68.108c-28.871,78.752,1.61,124.571,1.92,125.022 c17.334,26.978,39.466,40.624,65.829,40.624c19.874,0,41.881-7.664,65.405-22.773l2.807-1.795 c-37.181-34.794-78.393-72.481-84.403-122.798c-0.838-7.006,4.998-10.595,10.459-10.138c-3.796,2.23-6.505,6.695-4.835,11.999 c15.246,48.489,47.771,84.599,84.186,117.484c0.696,0.631,1.403,1.256,2.099,1.882c0.702,0.626,1.398,1.262,2.099,1.887 c9.763,8.692,19.749,17.187,29.741,25.64c9.274,7.843,18.536,15.659,27.592,23.584c9.339,8.175,20.712-7.375,11.417-15.507 c-17.106-14.968-35-29.491-52.21-44.595c-0.702-0.615-1.387-1.246-2.089-1.866c-0.702-0.62-1.392-1.246-2.094-1.871 c19.091-13.07,34.756-26.853,38.655-45.471c3.361-16.056-2.252-34.669-17.149-56.893C188.973,66.319,77.369,19.825,24.376,0 C31.686,6.081,39.002,14.245,44.142,24.938z";

var soilMoistSVGPath = "M4539 6417 c-61 -17 -104 -50 -133 -100 -13 -23 -57 -143 -97 -267l-73 -225 0 -120 c-1 -101 3 -132 23 -193 28 -86 84 -178 149 -244 l46 -47-31 -98 c-35 -110 -351 -1087 -446 -1375 -34 -104 -66 -188 -72 -188 -5 0 -8625 -180 55 -93 31 -190 58 -215 61 -71 9 -128 -11 -181 -65 -44 -45 -48 -54-131 -311 -48 -146 -101 -313 -120 -372 l-33 -107 -65 -5 c-435 -39 -787 -176-1113 -435 -68 -54 -344 -313 -697 -656 -63 -61 -272 -261 -463 -444 -191-184 -354 -346 -362 -360 -55 -107 -12 -247 94 -304 l49 -27 3009 0 3009 0 5226 c108 53 153 196 97 304 -7 14 -82 97 -166 185 -85 88 -363 378 -618 645-255 267 -498 516 -540 554 -148 133 -284 225 -473 317 -64 30 -108 58 -10866 0 8 25 90 55 182 35 107 55 184 55 215 0 83 -45 157 -120 196 -19 10 -11544 -212 75 -98 31 -178 59 -178 62 0 3 104 325 231 716 127 391 247 762 267825 40 126 36 122 137 141 104 19 218 81 299 164 40 39 87 97 104 128 17 3166 159 107 286 85 260 91 309 52 383 -43 82 -62 91 -493 230 -219 71 -414 131-434 134 -19 3 -56 -1 -81 -7z m366 -557 c124 -41 149 -52 147 -67 -8 -48 -56-175 -74 -199 -58 -73 -204 -69 -259 8 -41 57 -42 93 -7 206 17 56 34 102 37102 3 0 74 -22 156 -50z m-2035 -3390 c78 -22 142 -91 161 -175 10 -43 9 -61-6 -111 -15 -52 -28 -69 -109 -151 -103 -103 -143 -125 -227 -125 -135 0 -241119 -226 254 8 68 24 92 130 196 118 117 176 140 277 112z m-1135 -935 c47-19 91 -61 114 -108 25 -52 28 -141 6 -194 -22 -53 -171 -201 -230 -229 -84-40 -174 -28 -244 33 -74 63 -102 173 -66 260 17 41 175 207 220 231 61 32133 35 200 7z m831 -8 c89 -46 138 -157 114 -258 -12 -49 -22 -64 -119 -160-89 -89 -114 -108 -154 -119 -100 -27 -206 15 -262 104 -26 42 -30 59 -30 1151 45 7 77 19 101 23 42 158 184 203 211 62 39 163 41 229 6z m1646 -12 c59-39 91 -96 96 -170 6 -94 -9 -127 -107 -228 -122 -127 -195 -157 -305 -125-54 16 -131 93 -145 144 -30 109 -10 165 102 281 51 52 105 102 120 110 72 37173 32 239 -12z";

var waterDropSVGPath = "M211,27.6c-8.4-10-16.4-19.2-23.6-27.6c-7.2,8.8-15.2,18-23.6,27.6C113,86,43,167.2,43,230.4c0,40,16,76,42.4,102 c26,26,62,42.4,102,42.4s76-16,102-42.4c26-26,42.4-62.4,42.4-102C331.8,167.2,261.8,86.4,211,27.6z M188.2,342 c-30,0-57.6-12.4-77.2-32c-19.6-19.6-32-47.2-32-77.2c-0.4-5.6,4.4-10,10-10c5.6,0,10,4.4,10,10c0,24.8,10,46.8,26,63.2 c16,16,38.4,26,63.2,26c5.6,0,10,4.4,10,10C198.2,337.6,193.8,342,188.2,342z";

var wateringCanSVGPath = "M490.307,165.398c-28.237,0-48.242,13.885-61.965,31.834l-0.803-24.786c0-12.068-8.444-22.988-18.867-22.988H201.166c-10.414,0-18.867,10.92-18.867,22.988l-2.333,65.704L56.771,138.949c5.814-13.933,6.493-25.541,0.516-29.701c-8.597-5.977-27.444,6.407-42.094,27.483c-14.65,21.066-19.555,43.07-10.959,49.046c6.589,4.578,19.172-1.596,31.292-14.181l140.221,184.527l-2.878,77.198c0,12.067,8.444,22.155,18.867,22.155H418.1c10.414,0,18.867-10.088,18.867-22.155l-1.511-40.593c17.7-21.793,38.25-36.49,58.322-51.322c35.716-26.393,69.442-51.006,69.442-105.886C563.221,193.397,533.921,165.398,490.307,165.398z M480.792,324.451c-15.023,11.103-31.155,23.218-46.464,38.403l-4.389-121.339c6.903-21.879,23.352-54.258,60.367-54.258c31.978,0,51.064,18.15,51.064,48.578C541.371,279.699,514.634,299.445,480.792,324.451z";

var appleBicepsSVGPath = "M4197 5110 c-61 -8 -102 -23 -175 -64 -38 -22 -100 -112 -107 -156-4 -22 -11 -42 -16 -46 -5 -3 -9 -17 -9 -31 0 -39 -36 -91 -114 -165 -69 -66-107 -88 -88 -50 6 9 13 37 17 62 4 25 13 59 20 75 56 132 57 149 6 174 -3918 -40 18 -60 0 -12 -11 -23 -30 -25 -42 -2 -12 -9 -44 -16 -72 -24 -105 -40-193 -52 -277 -7 -49 -15 -88 -18 -88 -3 0 -18 22 -34 48 -26 42 -30 58 -34146 l-4 99 -48 48 c-60 60 -104 73 -226 67 -73 -4 -100 -10 -130 -29 -51 -30-92 -72 -132 -134 l-33 -50 42 -7 c24 -4 45 -12 48 -16 3 -5 17 -13 31 -17 14-4 27 -10 30 -14 3 -3 42 -41 86 -83 l82 -78 57 0 c62 0 120 22 136 51 5 1120 19 32 19 30 0 68 -74 77 -147 5 -46 4 -53 -11 -53 -10 0 -20 4 -23 9 -3 4-29 11 -57 14 -28 4 -56 11 -63 16 -6 5 -29 12 -51 16 -44 8 -164 44 -180 55-5 4 -32 13 -60 19 -27 7 -54 16 -60 20 -5 5 -51 16 -100 25 -134 26 -316 12-412 -30 -17 -8 -38 -14 -46 -14 -8 0 -20 -6 -26 -14 -7 -8 -26 -18 -42 -21-16 -4 -29 -10 -29 -14 0 -4 -15 -14 -32 -23 -45 -22 -166 -135 -227 -211 -27-35 -68 -97 -91 -138 -22 -41 -45 -81 -49 -89 -12 -21 -46 -115 -66 -182 -19-63 -28 -68 -59 -39 -28 25 -141 85 -191 101 -22 7 -44 16 -49 21 -17 15 -16910 -190 -6 -11 -8 -27 -15 -37 -15 -15 0 -140 -90 -178 -127 -21 -21 -24 -8-8 29 39 86 60 203 65 356 2 84 9 155 13 158 5 3 9 15 9 28 0 24 22 48 52 5912 4 23 -2 35 -20 51 -75 124 -123 188 -123 35 0 86 22 105 45 14 17 40 20 405 0 -6 19 -28 41 -50 30 -28 53 -41 84 -46 64 -9 103 14 169 101 68 91 81 15149 226 -12 26 -21 68 -21 103 -1 52 -5 63 -32 91 -17 18 -56 43 -85 55 -30 13-57 31 -60 40 -15 47 -120 111 -202 125 -24 4 -45 11 -49 16 -7 12 -554 12-554 0 0 -5 -13 -12 -29 -16 -45 -10 -93 -72 -105 -138 -7 -40 -89 -130 -208-230 -49 -40 -90 -92 -143 -177 -5 -9 -37 -57 -70 -106 -33 -49 -65 -98 -71-109 -6 -11 -20 -37 -32 -57 -12 -21 -29 -63 -38 -95 -9 -32 -20 -62 -24 -68-3 -5 -17 -57 -30 -114 -25 -115 -24 -226 5 -331 8 -30 15 -69 15 -87 0 -18 5-33 10 -33 12 0 14 -133 2 -144 -16 -17 -39 -141 -31 -170 14 -49 65 -93 116-101 40 -6 119 -39 133 -55 33 -39 241 -160 274 -160 4 0 22 -6 39 -14 92 -40138 -50 277 -62 41 -3 83 -10 92 -15 9 -5 45 -9 80 -9 35 -1 113 -7 173 -1461 -7 126 -11 145 -9 90 10 185 26 199 34 40 21 114 48 121 44 4 -3 11 -20 14-39 4 -20 13 -48 21 -63 8 -15 15 -36 15 -45 0 -10 4 -18 9 -18 5 0 13 -15 16-32 9 -41 102 -235 158 -329 82 -138 92 -154 142 -215 14 -18 25 -35 25 -38 0-14 156 -191 217 -246 126 -113 250 -175 392 -197 53 -9 107 -15 121 -15 44 0212 30 295 52 44 12 96 26 115 30 47 12 231 5 258 -9 11 -6 30 -11 42 -11 120 36 -7 53 -14 74 -34 235 -45 370 -26 37 6 75 14 85 20 23 13 131 60 138 6010 0 131 80 183 122 89 71 207 197 261 278 8 12 29 41 45 64 27 35 83 125 122191 24 40 93 181 93 188 0 5 9 27 19 50 11 24 23 56 27 72 4 17 10 32 13 3511 9 43 115 55 181 l12 64 48 -2 c27 -1 54 -7 60 -13 13 -13 310 -14 334 -1 95 96 14 192 20 173 10 236 22 370 69 101 36 215 94 240 123 12 14 111 59 17479 96 30 101 37 101 134 0 45 -4 99 -8 121 -14 67 -11 98 18 225 44 185 47220 35 330 -7 58 -17 110 -21 116 -5 6 -13 35 -19 65 -5 30 -14 63 -19 74 -918 -36 79 -61 137 -9 21 -24 46 -42 72 -28 39 -84 127 -102 161 -43 80 -87135 -163 201 -97 84 -163 170 -163 213 0 9 -9 35 -20 58 -15 34 -29 48 -70 67-44 21 -68 25 -158 27 -59 1 -163 8 -232 15 -107 10 -136 10 -200 -3 -41 -8-84 -19 -95 -23 -11 -5 -41 -18 -67 -29 -30 -12 -57 -34 -75 -59 -25 -35 -83-71 -116 -72 -6 -1 -21 -8 -32 -18 -41 -34 -55 -65 -55 -122 0 -37 -6 -65 -20-88 -36 -59 -17 -179 34 -222 9 -7 16 -16 16 -21 0 -5 7 -17 15 -26 8 -10 21-27 29 -38 12 -17 26 -20 90 -20 l75 0 51 50 c27 27 50 44 50 38 0 -6 17 -2138 -33 53 -32 127 -31 184 3 42 24 88 75 88 97 0 15 32 12 58 -6 12 -8 22 -2622 -39 0 -13 5 -27 10 -30 6 -3 10 -39 10 -80 0 -41 -4 -77 -10 -80 -12 -8-13 -67 -1 -80 5 -6 14 -50 20 -100 6 -49 17 -108 25 -130 7 -22 16 -56 19-75 l6 -35 -32 35 c-113 125 -270 188 -381 154 -69 -21 -140 -51 -179 -74 -56-34 -109 -61 -111 -58 -2 2 -12 23 -23 48 -11 25 -25 56 -32 70 -19 42 -65117 -83 137 -10 11 -18 23 -18 26 0 28 -186 208 -229 222 -11 3 -27 12 -33 19-22 21 -112 55 -166 62 -29 4 -55 11 -58 15 -7 12 -221 12 -228 0 -3 -5 -32-12 -63 -15 -62 -7 -225 -43 -258 -57 -11 -4 -56 -13 -99 -20 -44 -6 -91 -15-105 -20 -13 -5 -49 -14 -80 -19 -31 -5 -69 -12 -85 -16 l-29 -7 6 46 c4 2611 55 16 64 5 10 20 41 33 68 12 28 36 68 52 90 30 41 136 145 148 145 3 0 21-14 38 -31 34 -35 96 -79 110 -79 4 0 10 -6 12 -12 6 -18 182 -17 228 1 19 885 38 145 67 131 64 205 75 320 51 39 -8 71 -14 73 -12 1 1 -4 15 -13 31 -816 -15 34 -15 39 0 9 -65 143 -94 193 -32 55 -132 136 -201 162 -39 15 -21221 -298 10z";

const bicepsSVGPath = "M183.82,25.853c-0.828-0.951-2.178-1.348-3.403-1.062c-0.114,0.027-2.908,0.652-12.851,0.652c-6.726,0-12.576,3.534-15.268,9.223c-2.125,4.49-1.734,9.365,1.017,12.72c5.069,6.182,15.409,0.43,21.074-3.511c1.167,3.239,2.028,10.11,2.174,17.572c-8.735-1.638-15.606,2.505-19.338,6.328c-13.076-4.777-28.397,4.215-33.584,7.683c-0.403-0.519-0.889-1.41-1.292-2.86c-0.401-1.451,0.657-7.376,1.43-11.703c2.019-11.291,4.306-24.088-0.2-31.147c-7.728-12.107-16.821-10.663-34.289-2.848c-4.876,2.185-8.071,5.726-9.492,10.525c-3.729,12.587,6.395,29.662,9.586,34.596c0.538,0.833,1.318,2.461,0.483,3.994c-1.263,2.323-5.458,3.709-11.22,3.709c-12.271,0-23.197,2.826-26.481,3.763c-2.343-0.625-8.081-2.048-11.197-1.947c-2.082,0.067-4.867,0.845-7.108,1.594l-1.809-7.98c-0.044-0.198-0.106-0.393-0.186-0.58c-0.898-2.109-0.022-6.506,1.118-9.902c7.663-0.28,13.005-2.381,15.893-6.257c3.359-4.511,1.971-9.414,1.801-9.958c-0.046-0.147-0.101-0.288-0.166-0.428c-1.15-2.466-3.202-4.287-5.932-5.263c-9.752-3.483-26.902,4.509-28.826,5.432c-0.114,0.056-0.229,0.118-0.336,0.186c-5.934,3.721-8.211,17.821-8.864,23.095C0.157,83.251,0.003,108.795,0,109.898c-0.002,0.678,0.196,1.34,0.572,1.903c4.419,6.635,15.433,7.566,19.084,7.689c13.843,8.784,27.196,6.69,34.135,4.552c1.749,15.394,16.353,29.394,19.623,32.355c3.28,8.511-2.033,23.4-4.422,28.542c-0.384,0.828-0.423,1.775-0.106,2.628c0.319,0.853,0.964,1.546,1.794,1.922c8.943,4.043,17.647,5.466,25.475,5.466c18.098,0,31.507-7.61,32.299-8.079c1.579-0.915,2.157-2.91,1.316-4.528c-2.541-4.883,0.99-14.3,2.874-18.215c25.807-16.509,32.15-46.607,33.599-56.921c14.423,0.514,31.191-10.708,34.348-12.913c8.861-2.852,15.208-16.099,15.208-23.974C215.799,63.183,193.437,36.845,183.82,25.853z M198.221,87.89c-0.41,0.108-0.797,0.29-1.14,0.539c-0.198,0.143-19.919,14.28-33.191,11.679c-0.956-0.186-1.952,0.046-2.729,0.64c-0.777,0.594-1.261,1.493-1.331,2.468c-0.027,0.377-3.051,37.977-31.602,55.639c-0.517,0.319-0.939,0.771-1.222,1.307c-0.756,1.43-6.624,12.945-4.49,22.067c-6.659,3.043-25.615,10.037-45.955,2.314c2.567-6.576,7.385-21.521,2.807-31.596c-0.206-0.451-0.507-0.852-0.882-1.174c-0.193-0.169-19.417-16.91-17.963-32.352c0.116-1.239-0.456-2.44-1.487-3.14c-1.027-0.7-2.367-0.78-3.471-0.215c-0.667,0.34-16.485,8.18-32.974-2.811c-0.562-0.374-1.222-0.573-1.898-0.573c-0.01-0.002-0.022,0-0.034,0c-2.766,0-10.714-0.742-13.819-3.944c0.133-7.975,1.372-26.66,5.963-34.439c0.244-0.411,0.398-0.87,0.452-1.347c0.87-7.59,3.391-17.005,5.671-18.702c6.328-3,18.068-6.948,23.357-5.055c1.123,0.401,1.626,0.964,1.911,1.464c0.113,0.597,0.29,2.278-0.836,3.739c-1.785,2.314-6.303,3.557-12.708,3.476c-1.439-0.019-2.64,0.806-3.18,2.08c-0.466,1.094-4.402,10.718-2.016,16.973l2.609,11.522c0.222,0.983,0.865,1.816,1.761,2.278s1.951,0.505,2.879,0.119c2.227-0.927,6.499-2.418,8.482-2.481c2.046-0.065,7.281,1.166,10.09,1.958c0.64,0.181,1.319,0.171,1.949-0.029c0.121-0.038,12.112-3.741,25.423-3.741c11.537,0,15.739-4.557,17.217-7.272c1.841-3.384,1.568-7.38-0.748-10.964c-5.49-8.486-11.083-21.159-8.776-28.948c0.841-2.842,2.717-4.879,5.738-6.231c18.169-8.132,21.489-6.378,25.745,0.29c3.069,4.809,0.761,17.727-0.766,26.274c-1.345,7.523-2.067,11.918-1.287,14.729c2.266,8.172,7.523,8.429,8.115,8.431c0.005,0,0.01,0,0.015,0c0.741,0,1.463-0.241,2.057-0.688c5.062-3.821,20.442-12.563,30.636-7.221c1.512,0.79,3.371,0.334,4.362-1.038c0.273-0.379,6.822-9.195,17.725-4.741c1.041,0.425,2.224,0.311,3.164-0.305c0.939-0.618,1.516-1.659,1.539-2.784c0.2-9.774-0.41-26.663-6.757-29.967c-1.191-0.62-2.632-0.485-3.685,0.343c-6.19,4.862-13.339,7.846-14.351,6.601c-1.062-1.295-1.109-3.391-0.126-5.472c1.217-2.57,4.245-5.316,9.098-5.316c6.511,0,10.271-0.263,12.351-0.505c13.797,15.891,28.523,34.778,29.056,38.562C208.973,75.884,203.766,86.446,198.221,87.89z";

const strongManSVGPath = "M1452 6929 c-45 -10 -106 -31 -134 -45 -221 -112 -483 -451 -835-1084 -97 -174 -326 -625 -403 -795 -12 -27 -36 -78 -51 -112 -34 -72 -35-101 -10 -208 34 -142 106 -288 230 -470 257 -376 753 -859 1378 -1344 73 -56135 -106 138 -111 21 -34 171 -612 225 -865 11 -55 27 -129 35 -165 15 -72 39-206 61 -346 7 -50 16 -98 18 -105 3 -8 15 -102 27 -209 30 -267 31 -602 3-745 -10 -55 -19 -131 -19 -168 0 -64 2 -71 29 -92 16 -12 45 -25 65 -29 47-8 2535 -8 2582 0 20 4 49 17 65 29 27 21 29 28 29 92 0 37 -9 113 -19 168-28 143 -27 478 3 745 12 107 24 201 27 209 2 7 11 57 19 110 19 123 50 29274 406 10 50 26 124 34 165 33 158 196 774 212 799 3 5 85 72 183 148 168 131380 305 467 384 22 20 85 76 140 126 527 475 877 939 956 1268 26 110 24 136-17 224 -19 42 -52 112 -72 156 -20 44 -92 190 -159 325 -358 716 -690 1220-933 1415 -88 71 -151 101 -259 125 -148 33 -267 24 -366 -28 -45 -23 -121-99 -154 -154 -51 -86 -80 -227 -81 -393 0 -124 12 -158 74 -221 43 -42 66-56 121 -73 81 -25 176 -27 295 -6 47 8 88 15 91 15 12 0 58 -205 68 -305 6-55 13 -165 16 -245 13 -290 51 -504 133 -743 l41 -117 -37 -15 c-20 -9 -47-18 -61 -22 -32 -7 -145 -63 -205 -101 -73 -46 -146 -111 -224 -197 -81 -89-95 -110 -163 -240 l-46 -90 -84 -7 c-232 -21 -465 -105 -668 -240 l-86 -57-28 32 c-141 161 -185 276 -157 412 13 63 60 210 130 405 88 245 115 386 106560 -12 234 -94 415 -259 566 -84 77 -171 128 -277 162 -75 24 -101 27 -22027 -119 0 -145 -3 -220 -27 -196 -63 -357 -203 -454 -395 -51 -103 -75 -200-82 -333 -9 -174 18 -315 106 -560 70 -195 117 -342 130 -405 28 -136 -16-251 -157 -412 l-28 -32 -86 57 c-203 136 -437 219 -669 240 l-85 7 -23 50c-114 244 -285 421 -518 538 -38 19 -81 37 -95 40 -14 4 -41 13 -61 22 l-3615 39 112 c82 236 121 456 134 748 3 85 10 196 16 245 9 93 56 305 68 305 3 044 -7 91 -15 119 -21 214 -19 295 6 55 17 78 31 121 73 62 63 74 97 74 221 -1166 -30 307 -81 393 -33 55 -109 131 -154 154 -98 51 -228 61 -373 27z m266-236 c68 -33 112 -159 112 -318 0 -82 0 -83 -30 -95 -44 -18 -166 -8 -296 25-99 25 -115 27 -143 15 -42 -17 -63 -50 -94 -145 -60 -189 -81 -310 -97 -565-21 -346 -36 -459 -86 -640 -31 -116 -48 -160 -100 -267 -26 -55 -44 -106 -44-127 0 -43 38 -91 83 -104 18 -5 68 -20 112 -32 156 -44 352 -158 430 -251102 -122 151 -203 181 -303 10 -33 31 -71 46 -87 26 -26 34 -27 155 -34 282-15 501 -98 726 -275 129 -102 152 -99 278 35 206 221 283 388 264 578 -11111 -38 207 -145 507 -81 225 -94 286 -94 440 -1 148 9 192 68 305 43 84 145182 229 223 341 164 720 -69 753 -464 11 -131 -9 -245 -77 -443 -150 -437-168 -503 -169 -623 -1 -162 77 -316 264 -518 128 -139 153 -143 282 -41 227179 446 262 724 277 125 7 133 8 158 34 15 15 39 63 55 108 87 250 314 450602 532 44 12 94 27 112 32 45 13 83 61 83 104 0 21 -18 72 -44 127 -117 242-158 439 -186 907 -16 259 -31 348 -92 549 -47 152 -97 192 -199 157 -119 -40-292 -58 -344 -34 -24 11 -25 15 -25 94 0 100 14 171 47 242 30 63 48 77 13093 75 15 155 3 240 -35 203 -93 567 -644 994 -1503 l190 -382 -21 -78 c-111-393 -638 -972 -1505 -1650 -99 -77 -188 -150 -198 -161 -10 -11 -32 -66 -48-123 -85 -292 -131 -465 -179 -679 -16 -74 -34 -151 -39 -170 -6 -19 -24 -111-41 -205 -17 -93 -32 -177 -35 -185 -9 -31 -54 -361 -70 -515 -19 -184 -22-562 -6 -673 6 -41 9 -78 5 -83 -7 -12 -2261 -12 -2268 0 -4 5 -1 42 5 83 16110 13 488 -6 673 -16 154 -61 484 -70 515 -3 8 -18 92 -35 185 -17 94 -35186 -40 205 -5 19 -18 73 -29 120 -47 203 -115 474 -147 585 -63 214 -74 249-92 268 -9 11 -87 74 -172 140 -880 686 -1407 1261 -1530 1666 l-22 73 42 91c368 783 756 1438 1000 1687 121 124 206 163 338 156 42 -3 88 -12 110 -23z";

var strongManHollowSVGPath = "M96.155,194.955c-7.828,0-16.532-1.423-25.475-5.466c-0.829-0.375-1.475-1.068-1.794-1.922c-0.317-0.853-0.278-1.801,0.106-2.628c2.389-5.142,7.702-20.031,4.422-28.542c-3.27-2.961-17.874-16.961-19.623-32.355c-6.939,2.138-20.292,4.233-34.135-4.552c-3.651-0.123-14.665-1.053-19.084-7.689c-0.375-0.563-0.573-1.225-0.572-1.903c0.003-1.103,0.157-26.646,6.554-38.42c0.654-5.274,2.93-19.374,8.864-23.095c0.108-0.068,0.222-0.13,0.336-0.186c1.923-0.923,19.074-8.916,28.826-5.432c2.731,0.976,4.782,2.797,5.932,5.263c0.065,0.14,0.119,0.282,0.166,0.428c0.171,0.544,1.558,5.448-1.801,9.958c-2.888,3.876-8.23,5.977-15.892,6.257c-1.14,3.396-2.016,7.793-1.118,9.902c0.08,0.188,0.142,0.382,0.186,0.58l1.809,7.98c2.241-0.749,5.026-1.527,7.108-1.594c3.116-0.101,8.854,1.323,11.197,1.947c3.284-0.937,14.21-3.763,26.481-3.763c5.762,0,9.957-1.386,11.22-3.709c0.835-1.533,0.055-3.161-0.483-3.994c-3.191-4.934-13.315-22.009-9.586-34.596c1.422-4.799,4.617-8.34,9.492-10.525c17.468-7.815,26.561-9.259,34.289,2.848c4.506,7.059,2.219,19.855,0.2,31.147c-0.773,4.326-1.831,10.252-1.43,11.703c0.403,1.451,0.889,2.342,1.292,2.86c5.187-3.468,20.507-12.46,33.584-7.683c3.732-3.823,10.604-7.967,19.338-6.328c-0.147-7.462-1.007-14.333-2.174-17.572c-5.664,3.941-16.005,9.692-21.074,3.511c-2.751-3.355-3.142-8.23-1.017-12.72c2.691-5.688,8.542-9.223,15.268-9.223c9.943,0,12.737-0.625,12.851-0.652c1.225-0.287,2.575,0.111,3.403,1.062c9.617,10.993,31.98,37.33,31.98,44.472c0,7.875-6.347,21.122-15.208,23.974c-3.157,2.205-19.925,13.426-34.348,12.913c-1.449,10.313-7.793,40.412-33.599,56.921c-1.884,3.915-5.415,13.332-2.874,18.215c0.841,1.618,0.263,3.613-1.316,4.528C127.662,187.345,114.253,194.955,96.155,194.955z M76.559,184.544c20.34,7.723,39.296,0.729,45.955-2.314c-2.133-9.122,3.734-20.637,4.49-22.067c0.283-0.536,0.705-0.988,1.222-1.307c28.551-17.662,31.575-55.262,31.602-55.639c0.07-0.975,0.555-1.874,1.331-2.468c0.777-0.594,1.773-0.826,2.729-0.64c13.273,2.601,32.993-11.535,33.191-11.679c0.343-0.249,0.73-0.432,1.14-0.539c5.545-1.444,10.752-12.006,10.752-17.556c-0.532-3.784-15.259-22.671-29.056-38.562c-2.08,0.242-5.84,0.505-12.351,0.505c-4.854,0-7.881,2.746-9.098,5.316c-0.983,2.08-0.935,4.176,0.126,5.472c1.012,1.244,8.161-1.739,14.351-6.601c1.053-0.828,2.493-0.963,3.685-0.343c6.347,3.304,6.956,20.193,6.757,29.967c-0.024,1.125-0.601,2.166-1.539,2.784c-0.94,0.616-2.123,0.73-3.164,0.305c-10.904-4.454-17.452,4.362-17.725,4.741c-0.992,1.372-2.85,1.828-4.362,1.038c-10.194-5.342-25.574,3.4-30.636,7.221c-0.594,0.447-1.316,0.688-2.057,0.688c-0.005,0-0.01,0-0.015,0c-0.592-0.002-5.849-0.259-8.115-8.431c-0.78-2.811-0.058-7.206,1.287-14.729c1.527-8.547,3.835-21.465,0.766-26.274c-4.256-6.668-7.576-8.422-25.745-0.29c-3.021,1.352-4.896,3.389-5.738,6.231c-2.307,7.789,3.285,20.463,8.776,28.948c2.316,3.584,2.589,7.579,0.748,10.964c-1.478,2.715-5.68,7.272-17.217,7.272c-13.31,0-25.301,3.703-25.422,3.741c-0.63,0.2-1.309,0.21-1.949,0.029c-2.809-0.792-8.044-2.022-10.09-1.958c-1.983,0.063-6.255,1.555-8.482,2.481c-0.928,0.386-1.983,0.343-2.879-0.119c-0.896-0.463-1.539-1.295-1.761-2.278L25.455,76.93c-2.386-6.255,1.55-15.879,2.016-16.973c0.539-1.275,1.741-2.099,3.18-2.08c6.405,0.08,10.923-1.162,12.708-3.476c1.126-1.461,0.949-3.142,0.836-3.739c-0.285-0.5-0.788-1.063-1.911-1.464c-5.289-1.893-17.029,2.055-23.357,5.055c-2.28,1.696-4.801,11.112-5.671,18.702c-0.055,0.476-0.208,0.935-0.452,1.347c-4.591,7.779-5.83,26.464-5.963,34.439c3.104,3.202,11.052,3.944,13.819,3.944c0.012,0,0.024-0.002,0.034,0c0.676,0,1.336,0.2,1.898,0.573c16.49,10.991,32.307,3.15,32.975,2.811c1.104-0.565,2.444-0.485,3.471,0.215c1.031,0.7,1.603,1.901,1.487,3.14c-1.454,15.442,17.77,32.183,17.963,32.352c0.375,0.323,0.676,0.724,0.882,1.174C83.944,163.023,79.126,177.968,76.559,184.544z";

const cropHealthVals = [
                        {
                            value   :   0,
                            color   :   "#185C18",
                            label   :   "Excellent"
                        },
                        {                       
                            value   :   40,
                            color   :   "#aecb51",
                            label   :   "Good"
                        },
                        {
                            value   :   11,
                            color   :   "#ffff00",
                            label   :   "Fair"
                        },                       
                        {
                            value   :   6,
                            color   :   "#D89A28",
                            label   :   "Poor"
                        },
                          {
                            value   :   43,
                            color   :   "#ff0000",
                            label   :   "Very Poor"
                        }
                        ];
const cropMoistVals = [{
                            value   :   12,
                            color   :   "#185C18",
                            label   :   "Excellent"
                        },
                        {                       
                            value   :   33,
                            color   :   "#aecb51",
                            label   :   "Good"
                        },
                        {
                            value   :   6,
                            color   :   "#ffff00",
                            label   :   "Fair"
                        },
                        {
                            value   :   6,
                            color   :   "#D89A28",
                            label   :   "Poor"
                        },
                          {
                            value   :   43,
                            color   :   "#ff0000",
                            label   :   "Very Poor"
                        },];
const soilMoistVals = [{
                            value   :   36,
                            color   :   "#185C18",
                            label   :   "Excellent"
                        },{                       
                            value   :   9,
                            color   :   "#aecb51",
                            label   :   "Good"
                        },
                        
                        {
                            value   :   12,
                            color   :   "#ffff00",
                            label   :   "Fair"
                        },
                        {
                            value   :   0,
                            color   :   "#D89A28",
                            label   :   "Poor"
                        },
                        {
                            value   :   43,
                            color   :   "#ff0000",
                            label   :   "Very Poor"
                        }];
const nutriVals = [     {
                            value   :   0,
                            color   :   "#185C18",
                            label   :   "Excellent"
                        },
                        {                       
                            value   :   17,
                            color   :   "#aecb51",
                            label   :   "Good"
                        },                 
                        {
                            value   :   12,
                            color   :   "#ffff00",
                            label   :   "Fair"
                        },                        
                        {
                            value   :   28,
                            color   :   "#D89A28",
                            label   :   "Poor"
                        },
                        {
                            value   :   43,
                            color   :   "#ff0000",
                            label   :   "Very Poor"
                        }];

const cropStageData =   [{
                            value   :   7,
                            label   :   "Germination",
                            color   :   "#ffff00"
                        },
                        {
                            value   :   5.5,
                            label   :   "Flowering",
                            color   :   "#D89A28"
                        },{
                            value   :   4,
                            label   :   "Early Maturity",
                            color   :   "#185C18"
                        },{
                            value   :   3,
                            label   :   "Late Maturity",
                            color   :   "#aecb51"
                        },
                        {
                            value   :   2,
                            label   :   "Fruting",
                            color   :   "#ff0000"
                        }
                    ];
var cropTimeLineData = [
                {
                  "Activity Date":"2019-09-18", "Activity Name":"Germination", "Activity Type":"Germination","Distance":16,"MovinTime":16,"activityColor":"#ff0000"
                },{
                  "Activity Date":"2019-09-20", "Activity Name":"Germination", "Activity Type":"Germination","Distance":5,"MovinTime":5,"activityColor":"#ff0000"
                },{
                  "Activity Date":"2019-09-22", "Activity Name":"Germination", "Activity Type":"Germination","Distance":5,"MovinTime":5,"activityColor":"#ff0000"
                },{
                  "Activity Date":"2019-11-01", "Activity Name":"Flowering", "Activity Type":"Flowering","Distance":11,"MovinTime":11,"activityColor":"#b9ce37"
                }
                ,{
                  "Activity Date":"2019-11-03", "Activity Name":"Flowering", "Activity Type":"Flowering","Distance":5,"MovinTime":5,"activityColor":"#b9ce37"
                },{
                  "Activity Date":"2019-11-04", "Activity Name":"Flowering", "Activity Type":"Flowering","Distance":5,"MovinTime":5,"activityColor":"#b9ce37"
                },{
                  "Activity Date":"2019-12-01", "Activity Name":"Early Maturity", "Activity Type":"Early Maturity","Distance":5,"Moving Time":16,"activityColor":"#ffff00"
                },{
                  "Activity Date":"2019-12-02", "Activity Name":"Early Maturity", "Activity Type":"Early Maturity","Distance":1,"Moving Time":10,"activityColor":"#ffff00"
                }
            ];
var weeklyData = [];
var dailyData = [];
var firstDay = new Date(cropTimeLineData[0]["Activity Date"]);
firstDay = am4core.time.round(firstDay, "year", 1);
var total = 0;

export default class CropAnalytics extends Component {

    constructor(props){
        super(props);

        this.state = {
            cropHealthVals  :   [],
            cropMoistVals   :   [],
            soilMoistVals   :   [],
            nutriVals       :   [],
            cropStageData   :   [],
            currCropName    :   ""
        };
    }

    renderPicChart = (chartInstance, chartSrcData, svgPath) =>{
        chartInstance.paddingTop = am4core.percent(5);
        this.chartInstance = chartInstance;
        chartInstance.data = chartSrcData;
        var series = chartInstance.series.push(new am4charts.PictorialStackedSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "label";
        
        series.slicesContainer.background.fill = am4core.color("#676767")
        series.slicesContainer.background.fillOpacity = 0.2;
        series.alignLabels = true;

        series.maskSprite.path = svgPath;

        series.labelsContainer.width = am4core.percent(100);
        series.alignLabels = true;
        series.slices.template.propertyFields.fill = "color";
        series.slices.template.propertyFields.stroke = "color";

        var gradientModifier = new am4core.LinearGradientModifier();
        gradientModifier.lightnesses = [0.2, -0.7];
        series.slices.template.fillModifier = gradientModifier;
        series.slices.template.strokeModifier = gradientModifier;

        // this makes the fills to start and end at certain location instead of taking whole picture
        //series.endLocation = 0.553;
        //series.startLocation = 0.1;
        // this makes initial fill animation
        series.hiddenState.properties.startLocation = 0.553;
        series.ticks.template.locationX = 0.7;
        series.labelsContainer.width = 120;
        //const elem = document.querySelector("[aria-labelledby='id-345-title']")[0];
        //console.log("Test ",elem);
    }

    renderStackChart = (chartInstance, chartSrcData) =>{
        let series = chartInstance.series.push(new am4charts.FunnelSeries());
        chartInstance.data = chartSrcData;
        series.colors.step = 2;
        series.dataFields.value = "value";
        series.dataFields.category = "label";
        series.slices.template.propertyFields.fill = "color";
        series.slices.template.tooltipText = "{category}: {value.value} Acres";
        series.labels.template.text = "{category}: [bold]{value}[/] Acres";
        series.alignLabels = true;
        series.orientation = "horizontal";
        series.bottomRatio = 0.5;
        series.valueIs = "area";
        chartInstance.legend = new am4charts.Legend();
        chartInstance.legend.position = "top";
    }

    redrawChartAnimation = (chartInstance) =>{
        const position = window.pageYOffset;
        // console.log(position);
        if((position >= 450) && (position <= 650)){
            chartInstance.appear();
        }
    }
    

    render(){
        const {currCropName} = this.state;
        
        return(
            <section className="mainWebContentSection">
                <Fragment>
                    <div className="landholdingHeader wrap">
                        <Row>
                            <Col lg="12" md="12" sm="12" className="noPadding">                            
                                <h4 className="farmerListHeading dvaraBrownText">
                                    Crop Analytics /
                                </h4>&nbsp;
                                <h6 className="farmerListHeading dvaraBrownText">
                                    Crop Name : {currCropName}
                                </h6>               
                            </Col>
                        </Row>
                        <Row className="padTop10">
                            <Col lg="6" md="6" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsMainCard">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Crop Health Score</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div id="cropHealthChartdiv" className="wrap chartContainer"></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg="6" md="6" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsMainCard">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Crop Moisture Score</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div id="cropMoistChartdiv" className="wrap chartContainer"></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="padTop10">
                            <Col lg="6" md="6" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsMainCard">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Soil Moisture Score</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div id="soilMoistChartdiv" className="wrap chartContainer"></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col lg="6" md="6" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsMainCard">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Nutrient Score</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div id="nutriChartdiv" className="wrap chartContainer"></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="padTop10">
                            <Col lg="12" md="12" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsFullWidthCards">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Crop Stages</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <div id="cropPlantStagesChartDiv" className="wrap cropStageContainer"></div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row className="padTop10">
                            <Col lg="12" md="12" sm="12" className="noPadding">
                                <div className="maskLayer cropHealthMask"></div>
                                <Card className="analyticsFullWidthCards">        
                                    <Card.Header>
                                        <Card.Title>
                                            <h5 className="farmerListHeading dvaraBrownText">Crop Timeline Data</h5>
                                        </Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        {/*<div id="cropPlantTimeLineChartDiv" className="wrap cropStageContainer"></div>*/}
                                        <img src={cropTimelineImg} alt="Crop Timeline" className="wrap cropStageContainer" style={{margin:"0 auto"}}/>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <div className="verticalSpacer20"></div>
                </Fragment>
            </section>
        );
    }
    prepareDistanceData(chart, data) {
        for (var i = 0; i < 7; i++) {
          dailyData.push({ day: chart.dateFormatter.language.translate(chart.dateFormatter.weekdaysShort[i]) });
        }
      
        for (let i = 0; i < 53; i++) {
          weeklyData[i] = {};
          weeklyData[i].distance = 0;
          var date = new Date(firstDay);
          date.setDate(i * 7);
          am4core.time.round(date, "week", 1);
          var endDate = am4core.time.round(new Date(date), "week", 1);
      
          weeklyData[i].date = date;
          weeklyData[i].endDate = endDate;
        }
      
        am4core.array.each(data, function(di) {
          var date = new Date(di["Activity Date"])
          var weekDay = date.getDay();
          var weekNumber = am4core.utils.getWeek(date);
      
          if (weekNumber === 1 && date.getMonth() === 11) {
            weekNumber = 53;
          }
      
          var distance = di["Distance"];//am4core.math.round(di["Distance"] / 1000, 1);
          //console.log(di["Activity Name"]);
          var activity = di["Activity Name"];
          var colorVal = di["activityColor"];
          weeklyData[weekNumber - 1].distance += distance;
          weeklyData[weekNumber - 1].distance = am4core.math.round(weeklyData[weekNumber - 1].distance, 1);
          total += distance;
      
          dailyData.push({ date: date, day: chart.dateFormatter.language.translate(chart.dateFormatter.weekdaysShort[weekDay]), distance: distance, activity: activity, colors: colorVal, title: di["Activity Name"] });
        })
      }

    componentDidMount(){
        if(!localStorage.getItem('user')){
            this.props.history.push('/')
            return
          }
        let currCropName = this.props.match.params.cropName;
        UserService.getCropAnalytics(currCropName).then(
            (response) => {
            //   console.log(response.data);
              this.setState({
                cropHealthVals  :   response.data["Crop Health Score"],
                cropMoistVals   :   response.data["Crop Moisture Score"],
                soilMoistVals   :   response.data["Soil Moisture Score"],
                nutriVals       :   response.data["Nutrient Score"],
                cropStageData   :   response.data.stage
              });
            },
            (error) => {
                console.log("error");
              /* this.setState({
                isLoadingFarmersTabData: false,
                content:
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString(),
              }); */
            }
          );
        var cropHealthchart = am4core.create("cropHealthChartdiv", am4charts.SlicedChart);
        cropHealthchart.exporting.menu = new am4core.ExportMenu();
        cropHealthchart.exporting.menu.align = "left";
        cropHealthchart.exporting.menu.verticalAlign = "top";
        cropHealthchart.exporting.formatOptions.getKey("csv").disabled = true;
        cropHealthchart.exporting.formatOptions.getKey("json").disabled = true;        
        cropHealthchart.exporting.formatOptions.getKey("html").disabled = true;
        cropHealthchart.exporting.formatOptions.getKey("xlsx").disabled = true;
        cropHealthchart.exporting.formatOptions.getKey("pdf").disabled = true;
        cropHealthchart.exporting.formatOptions.getKey("svg").disabled = true;
        cropHealthchart.exporting.defaultStyles = false;
        cropHealthchart.exporting.filePrefix = "CropHealth_Score_For_"+this.state.currCropName+"";
        
        var cropMoistChart = am4core.create("cropMoistChartdiv", am4charts.SlicedChart);
        cropMoistChart.exporting.menu = new am4core.ExportMenu();
        cropMoistChart.exporting.menu.align = "left";
        cropMoistChart.exporting.menu.verticalAlign = "top";
        cropMoistChart.exporting.formatOptions.getKey("csv").disabled = true;
        cropMoistChart.exporting.formatOptions.getKey("json").disabled = true;        
        cropMoistChart.exporting.formatOptions.getKey("html").disabled = true;
        cropMoistChart.exporting.formatOptions.getKey("xlsx").disabled = true;
        cropMoistChart.exporting.formatOptions.getKey("pdf").disabled = true;
        cropMoistChart.exporting.formatOptions.getKey("svg").disabled = true;
        cropMoistChart.exporting.filePrefix = "CropMoisture_Score_For_"+this.state.currCropName+"";

        var soilMoistChart = am4core.create("soilMoistChartdiv", am4charts.SlicedChart);
        soilMoistChart.exporting.menu = new am4core.ExportMenu();
        soilMoistChart.exporting.menu.align = "left";
        soilMoistChart.exporting.menu.verticalAlign = "top";
        soilMoistChart.exporting.formatOptions.getKey("csv").disabled = true;
        soilMoistChart.exporting.formatOptions.getKey("json").disabled = true;        
        soilMoistChart.exporting.formatOptions.getKey("html").disabled = true;
        soilMoistChart.exporting.formatOptions.getKey("xlsx").disabled = true;
        soilMoistChart.exporting.formatOptions.getKey("pdf").disabled = true;
        soilMoistChart.exporting.formatOptions.getKey("svg").disabled = true;
        soilMoistChart.exporting.filePrefix = "SoilMoisture_Score_For_"+this.state.currCropName+"";

        var nutriChart = am4core.create("nutriChartdiv", am4charts.SlicedChart);
        nutriChart.exporting.menu = new am4core.ExportMenu();
        nutriChart.exporting.menu.align = "left";
        nutriChart.exporting.menu.verticalAlign = "top";
        nutriChart.exporting.formatOptions.getKey("csv").disabled = true;
        nutriChart.exporting.formatOptions.getKey("json").disabled = true;        
        nutriChart.exporting.formatOptions.getKey("html").disabled = true;
        nutriChart.exporting.formatOptions.getKey("xlsx").disabled = true;
        nutriChart.exporting.formatOptions.getKey("pdf").disabled = true;
        nutriChart.exporting.formatOptions.getKey("svg").disabled = true;
        nutriChart.exporting.filePrefix = "CropMoisture_Score_For_"+this.state.currCropName+"";

        this.renderPicChart(cropHealthchart, this.state.cropHealthVals, leafSVGPath);
        this.renderPicChart(cropMoistChart, this.state.cropMoistVals, waterDropSVGPath);
        this.renderPicChart(soilMoistChart, this.state.soilMoistVals, wateringCanSVGPath);
        this.renderPicChart(nutriChart, this.state.nutriVals, strongManHollowSVGPath);

        let cropStagesChart = am4core.create("cropPlantStagesChartDiv", am4charts.SlicedChart);
        cropStagesChart.hiddenState.properties.opacity = 0;
        this.renderStackChart(cropStagesChart, this.state.cropStageData);

        window.addEventListener('scroll', () => this.redrawChartAnimation(cropStagesChart), { passive: true });
        let exportButton = document.getElementsByClassName("amcharts-amexport-label");
        //console.log(exportButton);
        exportButton.innerHTML = "";

        var cropTimeLineChart = am4core.create("cropPlantTimeLineChartDiv", am4charts.RadarChart);
        this.prepareDistanceData(cropTimeLineChart, cropTimeLineData);

        cropTimeLineChart.innerRadius = am4core.percent(15);
        cropTimeLineChart.radius = am4core.percent(90);
        cropTimeLineChart.data = weeklyData;
        cropTimeLineChart.fontSize = "11px";
        cropTimeLineChart.startAngle = 95;
        cropTimeLineChart.endAngle = cropTimeLineChart.startAngle + 350;

// Create axes
var dateAxis = cropTimeLineChart.xAxes.push(new am4charts.DateAxis());
dateAxis.baseInterval = { timeUnit: "week", count: 1 };
dateAxis.renderer.innerRadius = am4core.percent(40);
dateAxis.renderer.minGridDistance = 5;
dateAxis.renderer.labels.template.relativeRotation = 0;
dateAxis.renderer.labels.template.location = 0.5;
dateAxis.renderer.labels.template.radius = am4core.percent(-57);
dateAxis.renderer.labels.template.fontSize = "8px";
dateAxis.dateFormats.setKey("week", "w");
dateAxis.periodChangeDateFormats.setKey("week", "w");
dateAxis.cursorTooltipEnabled = false;

var valueAxis = cropTimeLineChart.yAxes.push(new am4charts.ValueAxis());
valueAxis.renderer.inversed = true;
valueAxis.renderer.radius = am4core.percent(40);
valueAxis.renderer.minGridDistance = 0;
valueAxis.renderer.minLabelPosition = 0.05;
valueAxis.renderer.axisAngle = 90;
valueAxis.cursorTooltipEnabled = false;
valueAxis.renderer.labels.template.fill = am4core.color("#ffffff");

// Create series
var columnSeries = cropTimeLineChart.series.push(new am4charts.RadarColumnSeries());
columnSeries.dataFields.dateX = "date";
columnSeries.dataFields.valueY = "distance";
columnSeries.dataFields.activity = "activity";
columnSeries.columns.template.strokeOpacity = 0;
columnSeries.columns.template.width = am4core.percent(95);
columnSeries.fill = am4core.color("#ffffff");
columnSeries.fillOpacity = 0.6;
columnSeries.tooltip.fontSize = 10;
columnSeries.tooltip.pointerOrientation = "down";
columnSeries.tooltip.background.fillOpacity = 0.5;
columnSeries.columns.template.tooltipText = "[bold]{date} - {endDate}\n[font-size:13px]Total {valueY} km";
columnSeries.cursorTooltipEnabled = false;

// weekday axis
var weekDayAxis = cropTimeLineChart.yAxes.push(new am4charts.CategoryAxis());
weekDayAxis.dataFields.category = "day";
weekDayAxis.data = dailyData;
weekDayAxis.renderer.innerRadius = am4core.percent(50);
weekDayAxis.renderer.minGridDistance = 0;
weekDayAxis.renderer.grid.template.location = 0;
weekDayAxis.renderer.line.disabled = true;
weekDayAxis.renderer.axisAngle = 90;
weekDayAxis.cursorTooltipEnabled = false;
weekDayAxis.renderer.labels.template.fill = am4core.color("#ffffff");

// bubble series
var bubbleSeries = cropTimeLineChart.series.push(new am4charts.RadarSeries())
bubbleSeries.dataFields.dateX = "date";
bubbleSeries.dataFields.categoryY = "day";
bubbleSeries.dataFields.value = "distance";
bubbleSeries.dataFields.activity = "activity";
bubbleSeries.yAxis = weekDayAxis;
bubbleSeries.data = dailyData;
bubbleSeries.strokeOpacity = 0;
bubbleSeries.maskBullets = false;
bubbleSeries.cursorTooltipEnabled = false;
bubbleSeries.tooltip.fontSize = 10;
bubbleSeries.tooltip.pointerOrientation = "down";
bubbleSeries.tooltip.background.fillOpacity = 0.4;

var bubbleBullet = bubbleSeries.bullets.push(new am4charts.CircleBullet());
bubbleBullet.locationX = 0.5;
// console.log("_ACT_", bubbleSeries);
for (let j = 0; j<bubbleSeries.data.length; j++){
    if(bubbleSeries.data[j].activity === "Germination"){
        bubbleBullet.stroke = am4core.color("#b9ce37");
        bubbleBullet.fill = am4core.color("#b9ce37");
    }
    else if(bubbleSeries.data[j].activity === "Flowering"){
        bubbleBullet.stroke = am4core.color("#ff0000");
        bubbleBullet.fill = am4core.color("#ff0000");
    }
}


bubbleBullet.tooltipText = "[bold]{date}, {value}%\n[font-size:13px]{title}";
bubbleBullet.adapter.add("tooltipY", function(tooltipY, target) {
  return -target.circle.radius;
});

bubbleSeries.heatRules.push({ target: bubbleBullet.circle, min: 2, max: 12, dataField: "value", property: "radius" });
bubbleSeries.dataItems.template.locations.categoryY = 0.5;

// add month ranges
for (var i = 0; i < 13; i++) {
  var range = dateAxis.axisRanges.create();
  range.date = new Date(firstDay.getFullYear(), i, 0, 0, 0, 0);
  range.endDate = new Date(firstDay.getFullYear(), i + 1, 0, 0, 0, 0);
  if (i % 2) {
    range.axisFill.fillOpacity = 0.4;
  }
  else {
    range.axisFill.fillOpacity = 0.8;
  }
  range.axisFill.radius = -28;
  range.axisFill.adapter.add("innerRadius", function(innerRadius, target) {
    return dateAxis.renderer.pixelRadius + 7;
  })
  range.axisFill.fill = am4core.color("#b9ce37");
  range.axisFill.stroke = am4core.color("#5f6062");
  range.grid.disabled = true;
  range.label.text = cropTimeLineChart.dateFormatter.language.translate(cropTimeLineChart.dateFormatter.months[i])
  range.label.bent = true;
  range.label.radius = 10;
  range.label.fontSize = 10;
  range.label.paddingBottom = 5;
  range.label.interactionsEnabled = false;
  range.axisFill.interactionsEnabled = true;
  range.axisFill.cursorOverStyle = am4core.MouseCursorStyle.pointer;
  range.axisFill.events.on("hit", function(event) {
    if (dateAxis.start === 0 && dateAxis.end === 1) {
      dateAxis.zoomToDates(event.target.dataItem.date, event.target.dataItem.endDate);
    }
    else {
      dateAxis.zoom({ start: 0, end: 1 });
    }
  })
}

cropTimeLineChart.cursor = new am4charts.RadarCursor();
cropTimeLineChart.cursor.innerRadius = am4core.percent(40);
cropTimeLineChart.cursor.lineY.disabled = true;


var label = cropTimeLineChart.radarContainer.createChild(am4core.Label);
label.horizontalCenter = "middle";
label.verticalCenter = "middle";
label.fill = am4core.color("#72310C");
label.fontSize = 12;
label.fontWeight = "bold";
label.text = "Crop Timeline";
        
    }

    componentWillUnmount() {
        if (this.cropHealthchart) {
          this.cropHealthchart.dispose();
        }
        if (this.cropMoistChart) {
          this.cropMoistChart.dispose();
        }
        if (this.soilMoistChart) {
          this.soilMoistChart.dispose();
        }
        if (this.nutriChart) {
          this.nutriChart.dispose();
        }
        if(this.cropStagesChart){
            this.cropStagesChart.dispose();
        }
      }

}