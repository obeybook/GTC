import React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'reactstrap';
import Header from './components/layout/Header';
import Content from './components/layout/Content';
import Category from './components/layout/Category';

const ContainerWrapper = styled.div`
  background-color: rgb(243, 242, 240);
`;

const Container = styled.div`
  max-width: none !important;
  margin-right: auto;
  margin-left: auto;

  
  @media (min-width: 0px) {
      width: 100%;
  }
  
  @media (min-width: 768px) {
      width: 690px;
  }

  @media (min-width: 992px) {
      width: 910px;
  }
  
  @media (min-width: 1200px) {
      width: 1100px;
  }
  
  
  height : 100vh;
`;

const UnderSection = styled(Row)`
  margin : 0 !important;
`;

const App = () => (
  <ContainerWrapper>
    <Container>
      <Header />
      <UnderSection>
        <Col>
          <Category />
        </Col>
        <Col xs="10">
          <Content />
        </Col>
      </UnderSection>
    </Container>
  </ContainerWrapper>

);

export default App;
