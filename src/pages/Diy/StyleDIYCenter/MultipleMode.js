import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { ReactSVG } from 'react-svg';
import { InputNumber, Tooltip } from 'antd';
import SearchInput from '@/components/SearchInput';
import Select from '@/components/Select';
import StyleItem from '@/components/StyleItem';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { useIntl } from 'umi';
// react-list
import SelectedIcon from '@/public/icons/icon-selected.svg';
import SingleIcon from '@/public/icons/icon-single.svg';
import AllIcon from '@/public/icons/icon-all.svg';

const waitTime = time => {
    let p = new Promise(resovle => {
        setTimeout(() => {
            resovle('go');
        }, time);
    });
    return p;
};
window.timeOrder = false;
const App = ({
    styleList = { docs: [] },
    selectStyleList,
    dispatch,
    selectColorList,
    singleSelectColorList = [],
    singleSelectColorList1 = [],
    currentGood = { category: [] },
    currentGoodCategoryMultiple = '',
    styleQueryKey,
    styleQueryChangeKey,
    currentAdminChannel,
    assign,
    // curChannslPrice,
}) => {
    const { formatMessage, locale } = useIntl();
    // const [selectAssignedStyleList, setSelectAssignedStyleList] = useState([]);
    const [currentGoodCategoryIsTop, setCurrentGoodCategoryIsTop] = useState(false);
    let docs = [];
    let selectedNum = 0;
    if (styleList[currentGoodCategoryMultiple]) {
        docs = styleList[currentGoodCategoryMultiple];
        selectedNum = docs.filter(x => x.isSelected).length;
        // console.log('docs', docs);
    }

    const handleFetchMore = async (fetchType, styleNo) => {
        if (currentGood._id) {
            const payload = {
                _id: currentGood._id,
                fetchType,
            };
            if (fetchType) {
                payload.fetchType = fetchType;
            }
            if (styleNo) {
                payload.styleNo = styleNo;
            }
            dispatch({
                type: 'diy/fetchStyleList',
                payload,
            });
        }
    };

    const handleToggleTime = async () => {
        window.timeOrder = !window.timeOrder;
        console.log('window.timeOrder', window.timeOrder);

        styleList[currentGoodCategoryMultiple] = styleList[currentGoodCategoryMultiple].sort((a, b) => {
            return window.timeOrder
                ? new Date(b.createdAt ? b.createdAt : b.createTime).getTime() -
                      new Date(a.createdAt ? a.createdAt : a.createTime).getTime()
                : new Date(a.createdAt ? a.createdAt : a.createTime).getTime() -
                      new Date(b.createdAt ? b.createdAt : b.createTime).getTime();
        });
        dispatch({
            type: 'diy/setStyleList',
            payload: {
                ...styleList,
            },
        });
    };
    const handleChangeCollocationPattern = pattern => {
        dispatch({
            type: 'diy/setCollocationPattern',
            payload: pattern,
        });
        dispatch({
            type: 'diy/batchSetSelectColorList',
            payload: {
                plainColors: [...singleSelectColorList.map(x => x._id), ...singleSelectColorList1.map(x => x._id)],
                flowerColors: [...singleSelectColorList.map(x => x._id), ...singleSelectColorList1.map(x => x._id)],
            },
        });
    };
    const handleSelectStyle = style => {
        dispatch({
            type: 'diy/toogleSelectStyle',
            payload: style,
        });
    };
    const handleSelectAll = () => {
        if (docs.length > selectedNum) {
            const payload = [...selectStyleList, ...docs.filter(x => selectStyleList.findIndex(s => s._id === x._id) < 0)];
            console.log('payload', payload);
            dispatch({
                type: 'diy/batchSetSelectStyleList',
                payload,
            });
        } else {
            dispatch({
                type: 'diy/batchSetSelectStyleList',
                payload: [],
            });
        }
    };
    useEffect(() => {
        if (Array.isArray(currentGood.category) && currentGood.category.length > 0) {
            handleSetCurrentGoodCategory(currentGood.category[0]._id);
            handleFetchMore('clear');
        }
    }, [currentGood]);

    // useEffect(() => {
    //     if (Array.isArray(currentGood.category) && currentGood.category.length > 0) {
    //         // handleSetCurrentGoodCategory(currentGood.category[0]._id);
    //         handleFetchMore('keep', styleQueryKey);
    //     }
    // }, [styleQueryKey]);
    useEffect(() => {
        const finded = currentGood.category.find(x => x._id === currentGoodCategoryMultiple);
        // [].includes()
        setCurrentGoodCategoryIsTop(finded ? finded.name.includes('单衣') : false);
    }, [currentGood, currentGoodCategoryMultiple]);

    useEffect(() => {
        // if (styleQueryKey) {
        handleFetchMore('clear');
        dispatch({
            type: 'diy/setStyleQueryChangeKey',
            payload: '',
        });
        dispatch({
            type: 'diy/setStyleQueryKey',
            payload: '',
        });
        // }
    }, [currentGood]);

    useEffect(() => {
        if ((currentAdminChannel._id, currentGoodCategoryMultiple && styleQueryKey)) {
            handleFetchMore('clear');
            dispatch({
                type: 'diy/setStyleQueryChangeKey',
                payload: '',
            });
            dispatch({
                type: 'diy/setStyleQueryKey',
                payload: '',
            });
        }
    }, [currentAdminChannel, currentGoodCategoryMultiple]);

    const handleEditPrice = ({ price, style }) => {
        console.log(selectStyleList);
        const findIndex = selectStyleList.findIndex(x => x._id === style);
        if (findIndex >= 0) {
            selectStyleList[findIndex].price = price;
            dispatch({
                type: 'diy/setSelectStyleList',
                payload: [...selectStyleList],
            });
        }
    };

    const handleSetCurrentGoodCategory = category => {
        dispatch({
            type: 'diy/setCurrentGoodCategoryMultiple',
            payload: category,
        });
    };

    const renderItem = (index, key) => {
        const d = docs[index];
        return (
            <div
                key={`${d._id}-${currentGoodCategoryMultiple}-${index}`}
                style={{
                    position: 'relative',
                    justifySelf: 'stretch',
                    alignSelf: 'stretch',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#ffffff',
                    width: '20%',
                    paddingBottom: '20px',
                }}
            >
                <ReactSVG
                    style={{
                        width: '10px',
                        height: '10px',
                        opacity: d.isSelected ? 1 : 0,
                    }}
                    src={SelectedIcon}
                />
                <Tooltip
                    title={d.styleNo}
                    key={`${d._id}-tooltip`}
                    getPopupContainer={() => {
                        if (!window.multipleModeDiv) {
                            window.multipleModeDiv = document.getElementById('multiple-mode');
                        }
                        if (!window.multipleModeDiv) {
                            return document.body;
                        }
                        return window.multipleModeDiv;
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: currentGoodCategoryIsTop ? 'flex-start' : 'center',
                        }}
                        onClick={() => {
                            handleSelectStyle({ item: d, index });
                        }}
                    >
                        <StyleItem
                            width={`${(d.styleSize / 27) * 7}vw`}
                            styleId={`${d._id}-item`}
                            colors={
                                assign
                                    ? []
                                    : [
                                          selectColorList[0],
                                          selectColorList[0],
                                          selectColorList[0],
                                          selectColorList[0],
                                          selectColorList[0],
                                          selectColorList[0],
                                      ]
                            }
                            key={`${d._id}-${index}-${Math.random() * 1000000}`}
                            {...d}
                            style={{
                                cursor: 'pointer',
                            }}
                        />
                    </div>
                </Tooltip>
            </div>
        );
    };
    // console.log('selectStyleList.length < docs.length ', selectStyleList, docs.length);
    return (
        <div
            style={{
                padding: '28px 0px',
                background: '#222222',
            }}
        >
            <div
                style={{
                    marginBottom: '60px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    position: 'relative',
                }}
                id="multiple-mode"
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '-10px',
                    }}
                >
                    <Select
                        value={currentGoodCategoryMultiple}
                        style={{ marginRight: '20px' }}
                        width="98px"
                        options={currentGood.category
                            .filter(x => x.name.indexOf('分体') < 0)
                            .map(c => ({ label: locale === 'en-US' ? c.enname : c.name, value: c._id }))}
                        onSelect={val => handleSetCurrentGoodCategory(val)}
                    />
                    <Select onClick={handleToggleTime} value="Time" disabled options={[{ label: 'Time', value: 'time' }]} />
                    <ReactSVG
                        src={AllIcon}
                        style={{
                            width: '20px',
                            height: '20px',
                            padding: '4px',
                            marginLeft: '24px',
                            marginBottom: '6px',
                            opacity: selectedNum < docs.length ? 0.3 : 1,
                        }}
                        onClick={() => {
                            handleSelectAll();
                        }}
                    />
                </div>
                <SearchInput
                    style={{ width: '180px', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    placeholder="SEARCH STYLE"
                    value={styleQueryChangeKey}
                    onSearch={e => {
                        dispatch({
                            type: 'diy/setStyleQueryKey',
                            payload: e.target.value,
                        });
                        if (Array.isArray(currentGood.category) && currentGood.category.length > 0) {
                            // handleSetCurrentGoodCategory(currentGood.category[0]._id);
                            handleFetchMore('keep', e.target.value);
                        }
                    }}
                    onChange={e => {
                        dispatch({
                            type: 'diy/setStyleQueryChangeKey',
                            payload: e.target.value,
                        });
                    }}
                />
                <div style={{ display: 'flex' }}>
                    <ReactSVG
                        src={SingleIcon}
                        className="mode-icon"
                        style={{
                            opacity: assign ? 0 : 1,
                            pointerEvents: assign ? 'none' : 'painted',
                        }}
                        onClick={() => {
                            handleChangeCollocationPattern('single');
                        }}
                    />
                </div>
            </div>
            {/* InfiniteScroll */}
            <div
                // dataLength={docs.length}
                // next={handleFetchMore}
                // hasMore={false}
                // height={600}
                // inverse={true}
                style={{
                    width: '100%',
                    height: '600px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    justifyItems: 'center',
                    alignItems: 'center',
                    gridGap: '20px 0',
                    justifyContent: 'center',
                    alignContent: 'start',
                    overflowY: 'scroll',
                    gridTemplateRows: 'repeat(3, 1fr)',
                }}
                loader={<h4 style={{ color: '#fff' }}>Loading...</h4>}
            >
                {docs.map((d, index) => {
                    let selected = null;
                    if (d.isSelected) {
                        selected = selectStyleList.find(x => x.style === d._id);
                    }
                    return (
                        <div
                            key={`${d._id}-${currentGoodCategoryMultiple}-${index}`}
                            style={{
                                position: 'relative',
                                justifySelf: 'stretch',
                                alignSelf: 'stretch',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                color: '#ffffff',
                            }}
                        >
                            <ReactSVG
                                style={{
                                    width: '10px',
                                    height: '10px',
                                    opacity: d.isSelected ? 1 : 0,
                                }}
                                src={SelectedIcon}
                            />
                            <Tooltip
                                title={d.styleNo}
                                key={`${d._id}-tooltip`}
                                getPopupContainer={() => {
                                    if (!window.multipleModeDiv) {
                                        window.multipleModeDiv = document.getElementById('multiple-mode');
                                    }
                                    if (!window.multipleModeDiv) {
                                        return document.body;
                                    }
                                    return window.multipleModeDiv;
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: currentGoodCategoryIsTop ? 'flex-start' : 'center',
                                    }}
                                    onClick={() => {
                                        handleSelectStyle({ item: d, index });
                                    }}
                                >
                                    <StyleItem
                                        width={`${(d.styleSize / 27) * 7}vw`}
                                        styleId={`${d._id}-item`}
                                        colors={
                                            assign
                                                ? []
                                                : [
                                                      selectColorList[0],
                                                      selectColorList[0],
                                                      selectColorList[0],
                                                      selectColorList[0],
                                                      selectColorList[0],
                                                      selectColorList[0],
                                                  ]
                                        }
                                        key={`${d._id}-${index}-${Math.random() * 1000000}`}
                                        {...d}
                                        style={{
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    );
                })}
            </div>

            {/* <div
                style={{
                    width: '100%',
                    overflowY: 'scroll',
                    height: '600px',
                }}
            >
                <ReactList
                    itemRenderer={renderItem}
                    length={docs.length}
                    type='uniform'
                />
            </div> */}
        </div>
    );
};

export default connect(({ diy = {}, channel = {} }) => ({
    styleList: diy.styleList,
    selectColorList: diy.selectColorList,
    selectStyleList: diy.selectStyleList,
    currentGood: diy.currentGood,
    currentGoodCategoryMultiple: diy.currentGoodCategoryMultiple,
    styleQueryKey: diy.styleQueryKey,
    styleQueryChangeKey: diy.styleQueryChangeKey,
    currentAdminChannel: channel.currentAdminChannel,
    singleSelectColorList: diy.singleSelectColorList,
    singleSelectColorList1: diy.singleSelectColorList1,
}))(App);
