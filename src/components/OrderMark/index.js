import { InputBottomWhiteBorder } from '@/components/Input';
import InputNumber from '@/components/InputNumber';
import Modal from '@/components/Modal';
import Select from '@/components/Select';
import SelectAll from '@/components/SelectAll';
import StyleItem from '@/components/StyleItem';
import IconBackageInfo from '@/public/icons/backage-info.svg';
import IconSave from '@/public/icons/icon-save.svg';
import SelectedIcon from '@/public/icons/icon-selected-black.svg';
import IconSend from '@/public/icons/icon-send.svg';
import { filterImageUrl } from '@/utils/helper';
import { Badge, Input, Popover, Skeleton } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import lodash from 'lodash';
import { useIntl } from 'umi';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ReactSVG } from 'react-svg';
import { Box, Flex, Image } from 'rebass/styled-components';
import Info from './Info';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `${grid}px`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : '',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: '100%',
    margin: '0',
    display: 'flex',
    overflowX: 'scroll',
    background: '#F8F8F8',
    border: '1px solid #161616',
});

const OrderMark = ({ commodityToOrderGroupList, readOnly, visible, onCancel, loading, onSave, onSend, onDelRow = () => {} }) => {
    const intl = useIntl();
    const [showChange, setShowChange] = useState(false);
    // const [selectRow, setSelectRow] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [countInfos, setCountInfos] = useState({}); // 所有尺码 数量信息
    const [singleTotalInfos, setSingleTotalInfos] = useState({}); //每行总数
    const [rowPickTypes, setRowPickTypes] = useState({}); //每行总数
    const [rowRemarks, setRowRemarks] = useState({}); //每行总数
    const [singleTotalPriceInfos, setSingleTotalPriceInfos] = useState({}); //每行总金额
    const [parteInfos, setParteInfos] = useState({}); // 所有 分数 信息
    useEffect(() => {
        setSourceData(commodityToOrderGroupList);

        // let initCountInfos = {};
        // let initParteInfos = {};
        // let initRowPickTypes = {};
        // let initRowRemarks = {};
        // const source = commodityToOrderGroupList.map((g, ri) => {
        //     initCountInfos[ri] = {};
        //     initParteInfos[ri] = {};
        //     // initRowRemarks[ri] = g.rowRemarks ? g.rowRemarks : '';
        //     // initRowPickTypes[ri] = g.pickType ? g.pickType : { val: 1, pieceCount: 1 };
        //     g.list.map(favorite => {
        //         const favoriteKey = `${favorite._id}-${ri}`;
        //         initCountInfos[ri][favoriteKey] = {};
        //         if (favorite.sizeInfoObject) {
        //             Object.keys(favorite.sizeInfoObject).map(s => {
        //                 const sizeKey = `${ri}-${favorite._id}-${s}`;
        //                 initCountInfos[ri][favoriteKey][sizeKey] = favorite.sizeInfoObject[s];
        //             });
        //         }

        //         // if (favorite.parte) {
        //         //     initParteInfos[ri][favoriteKey] = favorite.parte;
        //         // }
        //     });
        //     // g.pickType
        // });
    }, [commodityToOrderGroupList]);
    // useEffect(() => {
    //     let initCountInfos = {};
    //     let initParteInfos = {};
    //     let initRowPickTypes = {};
    //     let initRowRemarks = {};
    //     sourceData.map((g, ri) => {
    //         initCountInfos[ri] = {};
    //         initParteInfos[ri] = {};
    //         initRowRemarks[ri] = g.rowRemarks ? g.rowRemarks : '';
    //         initRowPickTypes[ri] = g.pickType ? g.pickType : { val: 1, pieceCount: 1 };
    //         g.list.map(favorite => {
    //             const favoriteKey = `${favorite._id}-${ri}`;
    //             initCountInfos[ri][favoriteKey] = {};
    //             if (favorite.sizeInfoObject) {
    //                 Object.keys(favorite.sizeInfoObject).map(s => {
    //                     const sizeKey = `${ri}-${favorite._id}-${s}`;
    //                     initCountInfos[ri][favoriteKey][sizeKey] = favorite.sizeInfoObject[s];
    //                 });
    //             }

    //             if (favorite.parte) {
    //                 initParteInfos[ri][favoriteKey] = favorite.parte;
    //             }
    //         });
    //     });
    //     setCountInfos(initCountInfos);
    //     setParteInfos(initParteInfos);
    //     setRowPickTypes(initRowPickTypes);
    //     setRowRemarks(initRowRemarks);
    // }, [sourceData]);
    useEffect(() => {
        sourceData.map((g, row) => {
            // let rowParte = parteInfos[row];
            if (sourceData[row].list.length < 1) return;
            // // console.log('sourceData[row], row', sourceData[row], row)
            let rowUnitPrice = 0;
            rowUnitPrice += sourceData[row].list[0].price;

            let sum = 0;
            // // console.log('rowPickTypes[row].val ', rowPickTypes[row].val);
            // if (rowPickTypes[row].val == 1) {
            if (sourceData[row].pickType?.pieceCount) {
                sum = lodash.sum(sourceData[row].list.map(l => lodash.sum(Object.values(l.sizeInfoObject))));
                sum = sum * sourceData[row].pickType.pieceCount;
            }
            // } else {
            //     for (var key in rowParte) {
            //         if (!countInfos[row][key]) return;
            //         let parte = rowParte[key];
            //         sum += lodash.sum(Object.values(countInfos[row][key])) * parte;
            //     }
            // }

            singleTotalInfos[row] = sum;
            singleTotalPriceInfos[row] = sum * rowUnitPrice;
        });
        setSingleTotalInfos({ ...singleTotalInfos });
        setSingleTotalPriceInfos({ ...singleTotalPriceInfos });
    }, [sourceData]);

    const onDragEnd = result => {
        const { source, destination } = result;
        const sInd = parseInt(source.droppableId, 10);

        // // console.log('onDragEnd sInd', source.droppableId, sInd)
        // // console.log('onDragEnd sInd', destination.droppableId)
        // // console.log(sourceData[sInd],sourceData[dInd])
        // dropped outside the list
        if (!destination) {
            // // console.log('dropped outside the list');
            const sourceClone = Array.from(sourceData[sInd].list);
            const [removed] = sourceClone.splice(source.index, 1);
            sourceData[sInd].list = sourceClone;

            const newKey = removed.styleAndColor.map(sc => sc.styleId).join('-');
            // rowPickTypes[Object.keys(rowPickTypes).length] = {
            //     val: 0,
            //     pieceCount: 0,
            // };
            // // console.log('removed', removed);
            setSourceData([
                ...sourceData,
                {
                    key: newKey,
                    list: [removed],
                    sizes: removed.styleAndColor[0].style.size ? removed.styleAndColor[0].style.size?.split('/') : '',
                    pickType: { val: 1, pieceCount: 0 },
                },
            ]);

            // setRowPickTypes({ ...rowPickTypes });
            return;
        }
        const dInd = parseInt(destination.droppableId, 10);
        if (sInd === dInd) {
            // // console.log('sInd === dInd');
            // // console.log('sInd', sInd);
            // // console.log('dInd', dInd);
            // // console.log('sourceData', sourceData);
            const items = reorder(sourceData[sInd].list, source.index, destination.index);
            const newState = [...sourceData];
            newState[sInd] = { ...sourceData[sInd], list: items };
            setSourceData(newState);
        } else if (sourceData[sInd].styleNos === sourceData[dInd].styleNos) {
            // // console.log('sourceData[sInd].key === sourceData[dInd].key', sourceData[sInd].key);
            const result = move(sourceData[sInd].list, sourceData[dInd].list, source, destination);
            const newState = [...sourceData];
            newState[sInd].list = result[sInd];
            newState[dInd].list = result[dInd];
            setSourceData(newState.filter(group => group.list.length));
        }
    };

    const parseOrderData = () => {
        const orderData = sourceData.map((row, ri) => {
            const { list, sizes, key, size, price, styleNos, originId, originNo, rowRemarks, pickType } = row;
            // let currentRowCountInfo = countInfos[ri] ? countInfos[ri] : {};
            // let currentRowParteInfo = parteInfos[ri] ? parteInfos[ri] : {};
            const items = list.map(favorite => {
                const favoriteKey = `${favorite._id}-${ri}`;
                // let currentCountInfo = favorite;

                // let currentParteInfo = currentRowParteInfo[favoriteKey] ? currentRowParteInfo[favoriteKey] : 0;

                let sizeInfoObject = favorite.sizeInfoObject;
                let total = lodash.sum(Object.values(sizeInfoObject));
                let unitPrice = favorite.price;

                let item = {
                    sizeInfoObject,
                    parte: 0, //废弃
                    total,
                    totalPrice: unitPrice * total,
                    price: unitPrice,
                };
                if (favorite.type === 'img') {
                    item.imgs = favorite.imgs;
                    item.type = 0;
                    item.colorObj = favorite.styleAndColor[0].colorIds[0];
                } else {
                    let colorCodes = favorite.styleAndColor.map(x => x.colorIds.map(c => c.code));
                    colorCodes = lodash.difference(lodash.flattenDeep(colorCodes));
                    item.type = 1;
                    item.favoriteId = favorite._id;
                    item.colorCodes = colorCodes.join('/');
                    // item.favoriteId = favorite.styleAndColor.map(x => x=> colorIds);
                    item.favorite = favorite.favoriteObj ? favorite.favoriteObj : favorite;
                }
                return item;
            });
            let aboutCases = singleTotalInfos[ri] && row.weight ? Math.ceil((singleTotalInfos[ri] * row.weight) / 35000) : 0;
            return {
                pickType,
                rowTotal: singleTotalInfos[ri],
                rowTotalPrice: singleTotalPriceInfos[ri],
                rowRemarks,
                items,
                isSelect: !!row.isSelect,
                size,
                price,
                styleNos,
                aboutCases,
                originId,
                originNo,
            };
        });
        return orderData;
    };

    const handleDelRow = row => {
        sourceData.splice(row, 1);
        setSourceData([...sourceData]);
    };

    const handleSend = async () => {
        const orderData = parseOrderData();
        await onSend(orderData);
        setShowChange(false);
    };

    const handleSave = async () => {
        const orderData = parseOrderData();
        await onSave(orderData);
        setShowChange(false);
    };

    const handleSelectAll = bool => {
        setSourceData(sourceData.map(x => ({ ...x, isSelect: bool })));
    };

    const renderCountsInfo = () => {
        let infosList = [];
        for (let i = 0; i < sourceData.length; i++) {
            infosList.push(...sourceData[i].list.filter(x => x.goodCategory));
        }

        let infos = lodash.groupBy(infosList, x => x.goodCategory.name);
        return Object.keys(infos).map(k => (
            <Flex flexDirection="column" alignItems="center" pl="10px">
                <div>{k}</div>
                <div>{infos[k].length}</div>
            </Flex>
        ));
    };
    // console.log('sourceData', sourceData)
    // if(parteInfos.length !== sourceData.length) return null;
    // if(countInfos.length !== countInfos.length) return null;
    // if(parteInfos.length !== parteInfos.length) return null;
    return (
        <Modal
            visible={visible}
            destroyOnClose
            onCancel={() => {
                const orderData = parseOrderData();
                onCancel(orderData);
            }}
            getContainer={document.body}
            width={'100%'}
            style={{ padding: 0 }}
            bodyStyle={{ padding: 0, paddingTop: '24px', paddingBottom: '80px' }}
            footer={null}
            title={intl.formatMessage({
                id: 'order_editor',
                defaultMessage: '订单制作器',
            })}
        >
            <Flex justifyContent="space-between" alignItems="center" ml="54px" mr="34px">
                {onSend ? (
                    <SelectAll
                        selectAll={sourceData.length === sourceData.filter(x => x.isSelect).length}
                        onSelectAll={bool => {
                            handleSelectAll(bool);
                        }}
                    />
                ) : (
                    <div />
                )}

                <Flex>
                    {renderCountsInfo()}
                    <Flex flexDirection="column" alignItems="center" pl="20px">
                        <div>ALL</div>
                        <div>{lodash.sumBy(sourceData, x => x.list.length)}</div>
                    </Flex>
                </Flex>
            </Flex>
            {loading ? <Skeleton active /> : null}

            <DragDropContext onDragEnd={onDragEnd}>
                {sourceData.map((el, ind) => {
                    // let currentRowCountInfo = countInfos[ind] ? countInfos[ind] : {};
                    // let currentRowParteInfo = parteInfos[ind] ? parteInfos[ind] : {};
                    return (
                        <Flex alignItems="center" m="0px 24px">
                            <ReactSVG
                                src={SelectedIcon}
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    opacity: el.isSelect ? '1' : '0.3',
                                    display: onSend ? 'block' : 'none',
                                }}
                                onClick={() => {
                                    sourceData[ind].isSelect = !sourceData[ind].isSelect;
                                    setSourceData([...sourceData]);
                                }}
                            />
                            <Box m="10px" width="100%" sx={{ position: 'relative' }} className="dropwrapper">
                                <Popover
                                    content={
                                        <Box width="160px">
                                            <Input.TextArea
                                                rows={3}
                                                value={el.rowRemarks}
                                                onChange={e => {
                                                    // rowRemarks[ind] = e.target.value;
                                                    // setRowRemarks({
                                                    //     ...rowRemarks,
                                                    // });
                                                    sourceData[ind].rowRemarks = e.target.value;
                                                    setSourceData([...sourceData]);
                                                    setShowChange(true);
                                                }}
                                            />
                                        </Box>
                                    }
                                >
                                    <ReactSVG
                                        src={IconBackageInfo}
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            position: 'absolute',
                                            top: '10px',
                                            right: '40px',
                                        }}
                                    />
                                </Popover>

                                <DeleteOutlined
                                    width="18px"
                                    height="18px"
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        display: !readOnly ? 'initial' : 'none',
                                    }}
                                    onClick={() => {
                                        handleDelRow(ind);
                                    }}
                                />

                                <Droppable key={ind} droppableId={`${ind}`} direction="horizontal" className="dropwrapper">
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            style={getListStyle(snapshot.isDraggingOver)}
                                            {...provided.droppableProps}
                                        >
                                            {el.list.map((favorite, index) => {
                                                const favoriteKey = `${favorite._id}-${ind}-${index}`;
                                                return (
                                                    <Draggable
                                                        isDragDisabled={onSend ? false : true}
                                                        key={favoriteKey}
                                                        draggableId={favoriteKey}
                                                        index={index}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style,
                                                                )}
                                                            >
                                                                <Flex justifyContent="space-around">
                                                                    <Flex
                                                                        flexDirection="column"
                                                                        alignItems="center"
                                                                        justifyContent="space-around"
                                                                    >
                                                                        {favorite.type === 'img' ? (
                                                                            <Box width="100px">
                                                                                {/* <Swiper> */}
                                                                                {/* {colorWithStyleImgs[current]?.imgs.map((item, i) => ( */}
                                                                                <Flex
                                                                                    justifyContent="center"
                                                                                    alignItems="center"
                                                                                    height="100%"
                                                                                >
                                                                                    <Image
                                                                                        src={filterImageUrl(favorite.imgs[0])}
                                                                                    />
                                                                                </Flex>
                                                                                {/* ))} */}
                                                                                {/* </Swiper> */}
                                                                            </Box>
                                                                        ) : (
                                                                            favorite.styleAndColor.map(d =>
                                                                                d.favoriteImgUrl ? (
                                                                                    <Image
                                                                                        sx={{ cursor: 'pointer' }}
                                                                                        key={`${favorite._id}-${d._id}-order`}
                                                                                        width={`${(d.style?.styleSize * 100) /
                                                                                            27}px`}
                                                                                        src={filterImageUrl(d.favoriteImgUrl)}
                                                                                    />
                                                                                ) : (
                                                                                    <StyleItem
                                                                                        styleId={`${favoriteKey}-${d._id}-item`}
                                                                                        colors={d.colorIds}
                                                                                        width={`${(d.style?.styleSize * 100) /
                                                                                            27}px`}
                                                                                        key={`${favorite._id}-${d._id}-order`}
                                                                                        {...d.style}
                                                                                        style={{
                                                                                            cursor: 'pointer',
                                                                                        }}
                                                                                    />
                                                                                ),
                                                                            )
                                                                        )}
                                                                    </Flex>
                                                                    <Box pl="8px">
                                                                        {favorite.styleAndColor.map(sc => (
                                                                            <Box p="8px 0">
                                                                                <Info
                                                                                    label={intl.formatMessage({
                                                                                        id: 'style_ref',
                                                                                        defaultMessage: '编号',
                                                                                    })}
                                                                                    value={sc.style.styleNo}
                                                                                />
                                                                                <Info
                                                                                    label={intl.formatMessage({
                                                                                        id: 'color',
                                                                                        defaultMessage: '颜色',
                                                                                    })}
                                                                                    value={lodash
                                                                                        .union(sc.colorIds.map(c => c.code))
                                                                                        .join(',')}
                                                                                />
                                                                            </Box>
                                                                        ))}
                                                                        <Flex mb="30px">
                                                                            {el.sizes?.map(s => {
                                                                                // const sizeKey = `${ind}-${favorite._id}-${s}`;
                                                                                const sizeKey = `${ind}-${index}-${favorite._id}-${s}`;

                                                                                return (
                                                                                    <Flex
                                                                                        flexDirection="column"
                                                                                        alignItems="center"
                                                                                        key={sizeKey}
                                                                                    >
                                                                                        {s}
                                                                                        <InputNumber
                                                                                            readOnly={readOnly}
                                                                                            value={favorite.sizeInfoObject[s]}
                                                                                            onChange={val => {
                                                                                                sourceData[ind].list[
                                                                                                    index
                                                                                                ].sizeInfoObject[s] = val;
                                                                                                setSourceData([...sourceData]);
                                                                                                setShowChange(true);
                                                                                            }}
                                                                                        />
                                                                                    </Flex>
                                                                                );
                                                                            })}
                                                                        </Flex>
                                                                        <Info
                                                                            label={intl.formatMessage({
                                                                                id: 'unit_price',
                                                                                defaultMessage: '单价',
                                                                            })}
                                                                            value={favorite.price}
                                                                        />
                                                                        <Flex
                                                                            justifyContent="space-between"
                                                                            alignItems="center"
                                                                            pr="6px"
                                                                            minWidth="240px"
                                                                        >
                                                                            <Info
                                                                                label={intl.formatMessage({
                                                                                    id: 'subtotal',
                                                                                    defaultMessage: '小计',
                                                                                })}
                                                                                value={lodash.sum(
                                                                                    Object.values(favorite.sizeInfoObject),
                                                                                )}
                                                                            />
                                                                        </Flex>
                                                                    </Box>
                                                                </Flex>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                                <Flex height="36px" bg="#000000" p="0 22px" alignItems="center" justifyContent="space-between">
                                    <Flex alignItems="center">
                                        <Select
                                            width="260px"
                                            mode="white"
                                            disabled={readOnly}
                                            value={el.pickType?.val}
                                            placeholder={intl.formatMessage({
                                                id: 'choose_package_method',
                                                defaultMessage: '请选择包装方式',
                                            })}
                                            options={[
                                                {
                                                    label: intl.formatMessage({
                                                        id: 'order_pick_type0',
                                                        defaultMessage: '单色单码',
                                                    }),
                                                    value: 0,
                                                },
                                                {
                                                    label: intl.formatMessage({
                                                        id: 'order_pick_type1',
                                                        defaultMessage: '混色混码',
                                                    }),
                                                    value: 1,
                                                },
                                                {
                                                    label: intl.formatMessage({
                                                        id: 'order_pick_type2',
                                                        defaultMessage: '单色混码',
                                                    }),
                                                    value: 2,
                                                },
                                                {
                                                    label: intl.formatMessage({
                                                        id: 'order_pick_type3',
                                                        defaultMessage: '单色混码混箱',
                                                    }),
                                                    value: 3,
                                                },
                                            ]}
                                            onSelect={val => {
                                                // // console.log(val);
                                                sourceData[ind].pickType = { ...sourceData[ind].pickType, val };
                                                setSourceData([...sourceData]);
                                                // setRowPickTypes({
                                                //     ...rowPickTypes,
                                                // });
                                                setShowChange(true);
                                            }}
                                        />

                                        <Flex
                                            color="#ffffff"
                                            fontSize="12px"
                                            alignItems="center"
                                            style={{
                                                visibility: el.pickType?.val || el.pickType?.val === 0 ? 'visible' : 'hidden',
                                            }}
                                        >
                                            <Flex alignItems="center" p="0 10px">
                                                {intl.formatMessage({
                                                    id: 'per_package',
                                                    defaultMessage: '每份',
                                                })}
                                                <InputBottomWhiteBorder
                                                    readOnly={readOnly}
                                                    value={lodash.sum(
                                                        el.list.map(l => lodash.sum(Object.values(l.sizeInfoObject))),
                                                    )}
                                                />
                                                {intl.formatMessage({
                                                    id: 'pcs',
                                                    defaultMessage: '件',
                                                })}
                                            </Flex>
                                            <Flex
                                                alignItems="center"
                                                sx={{
                                                    '.ant-input-number-handler-wrap': {
                                                        display: 'none !important',
                                                    },
                                                }}
                                            >
                                                {intl.formatMessage({
                                                    id: 'total',
                                                    defaultMessage: '共',
                                                })}

                                                <InputNumber
                                                    readOnly={readOnly}
                                                    value={el.pickType?.pieceCount}
                                                    type="number"
                                                    style={{ width: '60px' }}
                                                    onChange={val => {
                                                        // rowPickTypes[ind] = { ...rowPickTypes[ind], pieceCount: val };
                                                        // setRowPickTypes({
                                                        //     ...rowPickTypes,
                                                        // });
                                                        sourceData[ind].pickType = {
                                                            ...sourceData[ind].pickType,
                                                            pieceCount: val,
                                                        };
                                                        setSourceData([...sourceData]);
                                                        // setRowPickTypes({
                                                        //     ...rowPickTypes,
                                                        // });

                                                        setShowChange(true);
                                                    }}
                                                />
                                                {intl.formatMessage({
                                                    id: 'packages',
                                                    defaultMessage: '份',
                                                })}
                                            </Flex>
                                        </Flex>
                                    </Flex>

                                    <Flex color="#ffffff">
                                        <Box>
                                            {intl.formatMessage({
                                                id: 'total_amount',
                                                defaultMessage: '总金额',
                                            })}
                                            :{singleTotalPriceInfos[ind] ? singleTotalPriceInfos[ind] : 0}
                                        </Box>
                                        <Box p="0 16px">
                                            {intl.formatMessage({
                                                id: 'total_quantity',
                                                defaultMessage: '总数量',
                                            })}
                                            :{singleTotalInfos[ind] ? singleTotalInfos[ind] : 0}
                                        </Box>
                                        <Box>
                                            {intl.formatMessage({
                                                id: 'box',
                                                defaultMessage: '大约',
                                            })}
                                            :
                                            {singleTotalInfos[ind] && el.weight
                                                ? Math.ceil((singleTotalInfos[ind] * el.weight) / 35000)
                                                : 0}
                                            {intl.formatMessage({
                                                id: 'none',
                                                defaultMessage: '箱',
                                            })}
                                        </Box>
                                    </Flex>
                                </Flex>
                            </Box>
                        </Flex>
                    );
                })}
            </DragDropContext>
            {readOnly ? null : (
                <Flex
                    sx={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                    }}
                    height="56px"
                    bg="#C0B3B6"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Badge dot={showChange}>
                        <ReactSVG
                            src={IconSave}
                            style={{
                                width: '20px',
                                height: '20px',
                            }}
                            onClick={() => {
                                handleSave();
                            }}
                        />
                    </Badge>
                    {onSend ? (
                        <ReactSVG
                            src={IconSend}
                            style={{
                                width: '18px',
                                height: '18px',
                                marginLeft: '40px',
                                marginBottom: '4px',
                            }}
                            onClick={() => {
                                handleSend();
                            }}
                        />
                    ) : null}
                </Flex>
            )}
        </Modal>
    );
};

export default OrderMark;
