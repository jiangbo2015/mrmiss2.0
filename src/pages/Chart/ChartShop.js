import { Card } from 'antd';
import Chart from 'bizcharts/lib/components/Chart';
import Coordinate from 'bizcharts/lib/components/Coordinate';
import Interval from 'bizcharts/lib/geometry/Interval';
import LineAdvance from 'bizcharts/lib/geometry/LineAdvance';
// import {   Interval, Point } from 'bizcharts';
import { connect } from 'dva';
import { useEffect } from 'react';
import { Box, Flex } from 'rebass/styled-components';
import Search from './Search';

const data2 = [
    {
        date: '2021-02',
        type: 'number',
        value: 1,
    },
    // {
    //     date: '2021-03',
    //     type: 'number',
    //     value: 11,
    // },
    // {
    //     date: '2021-04',
    //     type: 'number',
    //     value: 1111,
    // },
    {
        date: '2021-02',
        type: 'amount',
        value: 20,
    },
    // {
    //     date: '2021-03',
    //     type: 'amount',
    //     value: 80,
    // },
    // {
    //     date: '2021-04',
    //     type: 'amount',
    //     value: 100,
    // },
];

export const OrderRank = ({ data: originData = [] }) => {
    const data = originData.reduce(
        (left, right) =>
            left.concat([
                {
                    type: 'number',
                    value: right.number,
                    date: right.date,
                },
                {
                    type: 'amount',
                    value: right.amount,
                    date: right.date,
                },
            ]),
        [],
    );
    // console.log(data, 'data');
    return (
        <Card title="销售折线图">
            <Chart padding={[10, 20, 50, 50]} autoFit height={500} data={data}>
                <LineAdvance shape="smooth" point area position="date*value" color="type" />
                {/* <Line position="date*value" />
                <Point position="date*value" color="type" />
                <Tooltip showCrosshairs lock triggerOn="hover" />
                <Axis
                    name="销售件数"
                    title={{
                        position: 'center',
                        style: {
                            fontSize: '12',
                        },
                    }}
                /> */}
            </Chart>
        </Card>
    );
};

export const StyleRank = ({ data }) => (
    <Card title="款式销售排行">
        <Chart height={800} data={data} autoFit>
            <Coordinate transpose />
            <Interval position="styleNos*value" />
        </Chart>
    </Card>
);

export const UserRank = ({ data }) => (
    <Card title="客户排行">
        <Chart height={800} data={data} autoFit>
            <Coordinate transpose />
            <Interval position="user*value" />
        </Chart>
    </Card>
);

const ChartShop = ({ dispatch, shopData }) => {
    useEffect(() => {
        handleSearch();
    }, []);

    const handleSearch = value => {
        dispatch({
            type: 'chart/getShopData',
            payload: value,
        });
    };

    return (
        <Box>
            <Search handleSearch={handleSearch}></Search>

            <Flex>
                <Box width={1 / 2}>
                    <OrderRank data={shopData.orderRank}></OrderRank>
                    {/* <Card title="历史对比图" style={{ marginTop: '20px' }}>
                        <Chart height={300} autoFit data={data2}>
                            <Interval position="year*sales" />
                        </Chart>
                    </Card> */}
                </Box>

                <Box width={1 / 4} pl="20px">
                    <StyleRank data={shopData.styleRank}></StyleRank>
                </Box>
                <Box width={1 / 4} pl="20px">
                    <UserRank data={shopData.userRank}></UserRank>
                </Box>
            </Flex>
        </Box>
    );
};

export default connect(state => state.chart)(ChartShop);
