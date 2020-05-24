// Renders both modal and button
import React, { useState, useRef } from 'react';
import anime from 'animejs';

import useAction from '../../_utils/useAction.util';
import { createProject } from '../../_actions/projects.actions';

import { Container, ModalContainer } from './Base.style';
import AddButton from '../Filters/AddButton';

// For accessibility http://reactcommunity.org/react-modal/accessibility/
ModalContainer.setAppElement(document.getElementById('root'));

const AddProject = () => {
  const modalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const _createProject = useAction(createProject);

  const openModal = async () => {
    await anime({
      targets: modalRef.current,
      scale: {
        value: 1,
        duration: 800
      }
    }).finished;
    setIsOpen(true);
  };
  const closeModal = async () => {
    await anime({
      targets: modalRef.current,
      scale: {
        value: 0,
        duration: 800
      }
    }).finished;
    setIsOpen(false);
  };

  return (
    <Container>
      <AddButton onClick={openModal} />
      HELLO
      <ModalContainer
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Project Modal"
        contentRef={modalRef}
      >
        <button onClick={_createProject}>Create Project</button>
      </ModalContainer>
    </Container>
  );
};

export default AddProject;
