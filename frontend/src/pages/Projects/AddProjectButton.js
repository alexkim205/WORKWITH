// Renders both modal and button
import React, { Fragment, useState } from 'react';

import useAction from '../../_utils/useAction.util';
import { createProject } from '../../_actions/projects.actions';

import AddButton from '../../components/Filters/AddButton';
import Modal from '../../components/Modals';

const AddProjectButton = () => {
  const [isModalOpen, setIsModalOpen] = useState();
  const _createProject = useAction(createProject);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Fragment>
      <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} hide={closeModal}>
        <button onClick={_createProject}>Create Project</button>
      </Modal>
    </Fragment>
  );
};

export default AddProjectButton;
