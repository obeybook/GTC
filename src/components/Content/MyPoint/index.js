import React from 'react';
import {
  Container,
} from 'reactstrap';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import * as Proptypes from 'prop-types';
import useStores from '../../../stores/useStores';
import MyPointContent from './MyPointContent';

const MyPoint = ({ currentPage, noPagination }) => {
  const { UtilLoadingStore } = useStores();
  const { doLoading } = UtilLoadingStore;

  doLoading();

  return (
    <MainContainer>
      <h4>포인트 내역</h4>
      <MyPointContent noPagination={noPagination} currentPage={currentPage} />
    </MainContainer>
  );
};

const MainContainer = styled(Container)`
  border-bottom: 2px solid #ebeae8;
  border-right: 2px solid #ebeae8;
  background-color: white;
  padding: 1rem !important;
`;

MyPoint.propTypes = {
  currentPage: Proptypes.string,
  noPagination: Proptypes.bool,
};

MyPoint.defaultProps = {
  currentPage: '1',
  noPagination: false,
};

export default observer(MyPoint);
