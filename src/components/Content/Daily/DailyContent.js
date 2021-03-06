import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import useStores from '../../../stores/useStores';

import Loading from '../../util/Loading';
import DailyInput from './DailyInput';
import DailyList from './DailyList';

const DailyContent = () => {
  const {
    UtilLoadingStore,
  } = useStores();
  const { loading } = UtilLoadingStore;

  return (
    <>
      <Loading loading={loading} />
      <ContentWrapper loading={loading}>
        <DailyInput />
        <hr />
        <DailyList />
      </ContentWrapper>
    </>
  );
};

const ContentWrapper = styled.div`
  display: ${(props) => (props.loading ? 'none' : 'block')}
`;

export default observer(DailyContent);
