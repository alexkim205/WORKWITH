import styled from 'styled-components';
import Modal from 'react-modal';

import { backgroundColor } from '../../_constants/theme.constants';

const Container = styled.div``;

const ModalContainer = styled(Modal)`
  display: flex;
  flex-direction: column;
  background-color: ${backgroundColor};
`;

export { Container, ModalContainer };
