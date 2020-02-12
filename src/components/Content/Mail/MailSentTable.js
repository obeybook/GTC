import React from 'react';
import {
  Button,
} from 'reactstrap';
import styled from 'styled-components';
import { faEnvelope, faEnvelopeOpen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MailSentTable = (title, data, onClickEvent) => {
  const {
    id, message, targetName, date, isRead,
  } = data;

  return (
    <TableTr key={title + id}>
      <TableTd width={5}>
        <FontAwesomeIcon icon={isRead === 'Y' ? faEnvelopeOpen : faEnvelope} />
      </TableTd>
      <TableTd width={15}>
        {targetName}
      </TableTd>
      <TableTd width={60}>
        {message}
      </TableTd>
      <TableTd width={15}>
        {date}
      </TableTd>
      <TableTd width={5}>
        <DeleteBtn color="danger" size="sm" onClick={() => { onClickEvent(id); }}>
          삭제
        </DeleteBtn>
      </TableTd>
    </TableTr>
  );
};

const TableTd = styled.td`
  vertical-align: middle !important;
  width: ${(props) => props.width}%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 8px !important;
`;

const TableTr = styled.tr`
  height: 30px;
`;

const DeleteBtn = styled(Button)`
  margin: -5px 0 !important;
`;

export default MailSentTable;
