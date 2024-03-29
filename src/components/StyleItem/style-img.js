import React from 'react';
import { ReactSVG } from 'react-svg';
import { Box, Flex, Image } from 'rebass/styled-components';
import { filterImageUrl } from '@/utils/helper';
// import getDataUrl from 'get-dataurl';

export default props => {
    const {
        width,
        marginTemp = '0.2rem',
        backWidth,
        svgUrl,
        shadowUrl,
        svgUrlBack,
        shadowUrlBack,
        key,
        colors,
        svgId,
        styleId,
        showGroupStroke,
        imgValsAttrs = [],
        curStylesEditGroupIndex,
        onSetEditSvgGroupIndex,
        styleSize = 27,
        vposition = 'center',
        styleBackSize = 27,
    } = props;

    const maxWidth = styleSize > styleBackSize ? width : backWidth;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: vposition,
                justifyContent: 'space-around',
            }}
        >
            <Flex
                sx={{
                    width: maxWidth,
                }}
                justifyContent="center"
                alignItems="center"
                margin={`0 ${marginTemp}`}
            >
                <div
                    style={{
                        position: 'relative',
                        width: width,
                    }}
                >
                    <img
                        src={`${filterImageUrl(shadowUrl)}`}
                        style={{
                            width: width,
                            position: 'absolute',
                            left: 0,
                            pointerEvents: 'none',
                        }}
                    />
                    <ReactSVG
                        style={{
                            width: width,
                            minWidth: '14px',
                            fill: '#fff',
                        }}
                        afterInjection={(error, svg) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            let j = 0;
                            for (let i = 0; i < svg.children.length; i++) {
                                if (svg.children[i].tagName === 'g' || svg.children[i].tagName === 'path') {
                                    let block = svg.children[i];
                                    for (let i = 0; i < block.children.length; i++) {
                                        let cblock = block.children[i];
                                        cblock.removeAttribute('class');
                                        cblock.removeAttribute('fill');
                                    }

                                    if (onSetEditSvgGroupIndex) {
                                        let jj = j;

                                        block.onclick = e => {
                                            e.stopPropagation();

                                            onSetEditSvgGroupIndex(jj);
                                        };

                                        if (curStylesEditGroupIndex === j && showGroupStroke) {
                                            block.style.stroke = 'khaki';
                                            block.style.strokeWidth = '8px';
                                        }
                                    }
                                    // svg.children[i].setAttribute('index', j);
                                    if (colors && colors.length > 0 && j < colors.length && colors[j]) {
                                        let block = svg.children[i];
                                        block.style.fill = colors[j].type
                                            ? `url("#${styleId}-${colors[j]._id}-${j}")`
                                            : colors[j].value;
                                    }
                                    j++;
                                }
                            }
                        }}
                        renumerateIRIElements={false}
                        loading={() => {
                            return 'loading';
                        }}
                        beforeInjection={svg => {
                            // // console.log("curStylesEditGroupIndex", curStylesEditGroupIndex)
                            svg.setAttribute('id', svgId || key);
                            let svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                            svg.appendChild(svgDefs);
                            svg.setAttribute('style', `width: ${width}; height: 100%`);

                            for (let i = 0; i < colors.length; i++) {
                                let color = colors[i];
                                if (color && color.type) {
                                    let imgVals = imgValsAttrs.find(x => x.colorId === color._id) || {
                                        scale: 1,
                                        x: 0,
                                        y: 0,
                                    };
                                    // // console.log("imgVals", imgVals)
                                    let svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

                                    svgPattern.setAttribute('id', `${styleId}-${color._id}-${i}`);
                                    // editPatterns[color._id] = svgPattern
                                    svgPattern.setAttribute('patternUnits', 'userSpaceOnUse');
                                    svgPattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
                                    if (svg.width.baseVal.unitType === 2) {
                                        svg.setAttribute('width', `${svg.viewBox.baseVal.width}px`);
                                    }
                                    let W = ((color.size * svg.width.baseVal.value) / styleSize) * imgVals.scale;
                                    let H = (W * color.height) / color.width;

                                    svgPattern.setAttribute('width', `${W}px`);
                                    svgPattern.setAttribute('height', `${H}px`);
                                    svgPattern.x.baseVal.value = imgVals.x;
                                    svgPattern.y.baseVal.value = imgVals.y;

                                    let svgPatternImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

                                    svgPatternImage.setAttribute('width', `${W}px`);
                                    svgPatternImage.setAttribute('height', `${H}px`);
                                    svgPatternImage.href.baseVal = `${filterImageUrl(color.value)}`;

                                    // editSvgs.svgDefs.appendChild(svgPattern)
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                                }
                            }
                        }}
                        evalScripts="always"
                        src={`${filterImageUrl(svgUrl)}`}
                    />
                </div>
            </Flex>
            <Flex
                sx={{
                    width: maxWidth,
                }}
                justifyContent="center"
                alignItems="center"
                margin={`0 ${marginTemp}`}
            >
                <div
                    style={{
                        position: 'relative',
                        width: backWidth,
                    }}
                >
                    <img
                        src={`${filterImageUrl(shadowUrlBack)}`}
                        style={{
                            width: backWidth,
                            position: 'absolute',
                            left: 0,
                            pointerEvents: 'none',
                        }}
                    />
                    <ReactSVG
                        style={{
                            width: backWidth,
                            minWidth: '14px',
                            fill: '#fff',
                        }}
                        afterInjection={(error, svg) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            let j = 0;
                            for (let i = 0; i < svg.children.length; i++) {
                                if (svg.children[i].tagName === 'g' || svg.children[i].tagName === 'path') {
                                    let block = svg.children[i];
                                    for (let i = 0; i < block.children.length; i++) {
                                        let cblock = block.children[i];
                                        cblock.removeAttribute('class');
                                        cblock.removeAttribute('fill');
                                    }

                                    if (onSetEditSvgGroupIndex) {
                                        let jj = j;

                                        block.onclick = e => {
                                            e.stopPropagation();

                                            onSetEditSvgGroupIndex(jj);
                                        };

                                        if (curStylesEditGroupIndex === j && showGroupStroke) {
                                            block.style.stroke = 'khaki';
                                            block.style.strokeWidth = '8px';
                                        }
                                    }
                                    // svg.children[i].setAttribute('index', j);
                                    if (colors && colors.length > 0 && j < colors.length && colors[j]) {
                                        let block = svg.children[i];
                                        block.style.fill = colors[j].type
                                            ? `url("#${styleId}-${colors[j]._id}-${j}")`
                                            : colors[j].value;
                                    }
                                    j++;
                                }
                            }
                        }}
                        renumerateIRIElements={false}
                        loading={() => {
                            return 'loading';
                        }}
                        beforeInjection={svg => {
                            // // console.log("curStylesEditGroupIndex", curStylesEditGroupIndex)
                            svg.setAttribute('id', svgId || key);
                            let svgDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                            svg.appendChild(svgDefs);
                            svg.setAttribute('style', `width: ${backWidth}; height: 100%`);

                            for (let i = 0; i < colors.length; i++) {
                                let color = colors[i];
                                if (color && color.type) {
                                    let imgVals = imgValsAttrs.find(x => x.colorId === color._id) || {
                                        scale: 1,
                                        x: 0,
                                        y: 0,
                                    };
                                    // // console.log("imgVals", imgVals)
                                    let svgPattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern');

                                    svgPattern.setAttribute('id', `${styleId}-${color._id}-${i}`);
                                    // editPatterns[color._id] = svgPattern
                                    svgPattern.setAttribute('patternUnits', 'userSpaceOnUse');
                                    svgPattern.setAttribute('patternContentUnits', 'userSpaceOnUse');
                                    if (svg.width.baseVal.unitType === 2) {
                                        svg.setAttribute('width', `${svg.viewBox.baseVal.width}px`);
                                    }
                                    let W = ((color.size * svg.width.baseVal.value) / styleBackSize) * imgVals.scale;
                                    let H = (W * color.height) / color.width;

                                    svgPattern.setAttribute('width', `${W}px`);
                                    svgPattern.setAttribute('height', `${H}px`);
                                    svgPattern.x.baseVal.value = imgVals.x;
                                    svgPattern.y.baseVal.value = imgVals.y;

                                    let svgPatternImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');

                                    svgPatternImage.setAttribute('width', `${W}px`);
                                    svgPatternImage.setAttribute('height', `${H}px`);
                                    svgPatternImage.href.baseVal = `${filterImageUrl(color.value)}`;

                                    // editSvgs.svgDefs.appendChild(svgPattern)
                                    svgPattern.appendChild(svgPatternImage);
                                    svgDefs.appendChild(svgPattern);
                                }
                            }
                        }}
                        evalScripts="always"
                        src={`${filterImageUrl(svgUrlBack)}`}
                    />
                </div>
            </Flex>
        </div>
    );
};
