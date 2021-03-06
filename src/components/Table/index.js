import React from 'react';
import { Table } from 'antd';
import { Box } from 'rebass/styled-components';
const OrderTable = props => {
    return (
        <Box
            sx={{
                '.even': {
                    background: '#F3F3F3',
                },
                '.parent-row': {
                    background: '#C8C8C8',
                    '>td': {
                        padding: '8px 20px',
                    },
                    ':hover': {
                        '>td': {
                            background: 'none !important',
                        },
                    },
                },
                '.ant-table-row-expand-icon': {
                    background: '#FDDB3B',
                },
                '.ant-table-expanded-row': {
                    '>td': {
                        padding: 0,
                        paddingLeft: '56px',
                    },
                    '.ant-table-row': {
                        background: '#F6F6F6',
                    },
                },
                '.ant-table-row': {
                    textAlign: 'center',
                },
                '.ant-table-thead>tr>th': {
                    background: '#0E0E0E',
                    color: '#ffffff',
                    padding: '8px',
                    textAlign: 'center',
                },
            }}
        >
            <Table
                pagination={false}
                sticky
                rowClassName={(_, index) => (index % 2 === 1 ? 'odd' : 'even')}
                {...props}
            />
        </Box>
    );
};

export default OrderTable;
