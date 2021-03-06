import React from 'react';
import {
  TabPane, Table,
} from 'reactstrap';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import useStores from '../../../stores/useStores';
import PostLockerMyPostTable from './PostLockerMyPostTable';

const PostLockerMyPost = () => {
  const { BoardPostStore } = useStores();
  const { postMineList } = BoardPostStore;

  const MyPostTableData = postMineList.map((v) => (PostLockerMyPostTable('myPost', v)));

  return (
    <TabPane tabId="myPost">
      <ListTable size="sm" bordered>
        <thead>
          <tr>
            <TableTh width={10}>번호</TableTh>
            <TableTh width={60}>제목</TableTh>
            <TableTh width={20}>작성일</TableTh>
            <TableTh width={10}>조회수</TableTh>
          </tr>
        </thead>
        <tbody>
          {MyPostTableData.length === 0 ? (
            <tr>
              <TableTd colSpan={4}>
              작성한 글이 없습니다.
              </TableTd>
            </tr>
          ) : MyPostTableData}
        </tbody>
      </ListTable>
    </TabPane>
  );
};

const TableTh = styled.th`
  vertical-align: middle !important;
  width: ${(props) => props.width}%;
  padding: 8px !important;
`;

const TableTd = styled.td`
  vertical-align: middle !important;
  width: ${(props) => props.width}%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 8px !important;
`;

const ListTable = styled(Table)`
  border: 1px solid #c9c9c9 !important;
`;

export default observer(PostLockerMyPost);
