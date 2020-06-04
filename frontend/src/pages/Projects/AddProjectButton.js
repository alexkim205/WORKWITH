// Renders both modal and button
import React, { Fragment, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RiFileAddLine, RiShareForwardLine } from 'react-icons/ri';

import { secondaryColor } from '../../_constants/theme.constants';
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
import SquareFlipLoader from '../../components/Loader/SquareFlipLoader';

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
                <Input.Label>
                  <RiFileAddLine size={'1.7em'} />
                  Give your project a descriptive title
                </Input.Label>
                <Input.Text
                  type="text"
                  name="title"
                  placeholder="Name your project"
                  ref={register({
                    required: 'Project title is required.'
                  })}
                />
                <Input.Error>
                  {errors?.general?.message || errors?.title?.message}
                </Input.Error>
              </Input.Wrapper>
              <Input.Wrapper data-field-fade>
                <Input.Label>
                  <RiShareForwardLine size={'1.7em'} />
                  Share your project
                </Input.Label>
                <Input.Text
                  type="text"
                  name="title"
                  placeholder="Add people"
                  ref={register({
                    required: 'Project title is required.'
                  })}
                />
                <Input.Error>
                  {errors?.general?.message || errors?.title?.message}
                </Input.Error>
              </Input.Wrapper>
            </div>
            <div className="buttons-box">
              {(projectPending || projectsPending) && <SquareFlipLoader />}
              <ModalButton
                data-button-fade
                type="submit"
                disabled={projectPending || projectsPending}
                backgroundColor={secondaryColor}
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
