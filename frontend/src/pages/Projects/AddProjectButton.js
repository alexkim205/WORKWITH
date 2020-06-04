// Renders both modal and button
import React, { Fragment, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import useAction from '../../_utils/useAction.util';
import {
  createProject,
  getProjectsByUser
} from '../../_actions/projects.actions';
import { getCurrentUserAndToken } from '../../_selectors/users.selectors';
import {
  getProjectPendingAndError,
  getProjectsPendingAndError
} from '../../_selectors/projects.selectors';

import { Input } from '../../components/Form';
import { ModalButton } from '../../components/Button';
import AddButton from '../../components/Filters/AddButton';
import Modal from '../../components/Modals';

const AddProjectButton = () => {
  /* Component Setup */
  const formRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const _createProject = useAction(createProject);
  const _getProjectsByUser = useAction(getProjectsByUser);
  const { user } = useSelector(getCurrentUserAndToken);
  const { pending: projectPending } = useSelector(getProjectPendingAndError);
  const { pending: projectsPending } = useSelector(getProjectsPendingAndError);
  const { register, handleSubmit, errors, setError } = useForm();
  /* Component Setup End */

  /* Form functions */
  const _onSubmit = async data => {
    try {
      // Try to create project
      await _createProject(data);

      // If a project was created successfully, get refreshed list.
      // Project will update behind the modal overlay.
      if (user) {
        await _getProjectsByUser(user._id);
      }

      // Close the modal
      closeModal();
    } catch (error) {
      // If failure, display server error
      if (error.name === 'ServerError') {
        setError('general', 'serverError', error.message);
      }
    }
  };

  return (
    <Fragment>
      <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} hide={closeModal}>
        <div className="header"></div>
        <div className="form-box">
          <form onSubmit={handleSubmit(_onSubmit)} ref={formRef}>
            <div className="fields-box">
              <Input.Wrapper data-field-fade>
                <Input.Text
                  type="text"
                  name="title"
                  placeholder="Give Your Project a Descriptive Title"
                  ref={register({
                    required: 'Project title is required.'
                  })}
                />
              </Input.Wrapper>
            </div>
            <div className="buttons-box">
              <Input.Error>
                {errors?.general?.message || errors?.title?.message}
              </Input.Error>
              <ModalButton
                data-button-fade
                type="submit"
                disabled={projectPending || projectsPending}
              >
                Done
              </ModalButton>
            </div>
          </form>
        </div>
      </Modal>
    </Fragment>
  );
};

export default AddProjectButton;
