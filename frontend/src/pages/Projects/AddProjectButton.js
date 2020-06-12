// Renders both modal and button
import React, { Fragment, useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { RiFileAddLine, RiShareForwardLine } from 'react-icons/ri';

import Role from '../../_constants/role.constants';
import { secondaryColor } from '../../_constants/theme.constants';
import useAction from '../../_utils/useAction.util';
import { getContactsByUser } from '../../_actions/users.actions';
import {
  createProject,
  getProjectsByUser
} from '../../_actions/projects.actions';
import { getCurrentUserAndToken } from '../../_selectors/users.selectors';
import {
  getProjectPendingAndError,
  getProjectsPendingAndError
} from '../../_selectors/projects.selectors';
import { isEmail } from '../../_utils/regex.util';

import { Input } from '../../components/Form';
import { ModalButton } from '../../components/Button';
import AddButton from '../../components/Filters/AddButton';
import Modal from '../../components/Modals';
import SquareFlipLoader from '../../components/Loader/SquareFlipLoader';

const AddProjectButton = () => {
  /* Component Setup */
  const formRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState();
  const [contactOptions, setContactOptions] = useState();
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const _getContactsByUser = useAction(getContactsByUser);
  // const _updateUser = useAction(updateUser);
  const _createProject = useAction(createProject);
  const _getProjectsByUser = useAction(getProjectsByUser);
  const { user } = useSelector(getCurrentUserAndToken);
  const { pending: projectPending } = useSelector(getProjectPendingAndError);
  const { pending: projectsPending } = useSelector(getProjectsPendingAndError);
  const { register, handleSubmit, errors, setError, control } = useForm();
  /* Component Setup End */

  useEffect(() => {
    const fetchContacts = async () => {
      // console.log('getting contacts by user', user);
      if (user) {
        await _getContactsByUser(user._id);
        setContactOptions(contactOptions);
      }
    };

    try {
      fetchContacts();
    } catch (error) {
      // If failure, display server error
      if (error.name === 'ServerError') {
        setError('general', 'serverError', error.message);
      }
    }
  }, []);

  /* Form functions */
  const _onSubmit = async data => {
    try {
      const newProject = _.pick(data, ['title']);
      // const newContacts = _.pick(data, ['contacts']);

      // Try to create project
      await _createProject(newProject);

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

  // const watchAllFields = watch();
  // console.log('watched', watchAllFields);

  return (
    <Fragment>
      <AddButton onClick={openModal} />
      <Modal isOpen={isModalOpen} hide={closeModal}>
        <div className="header"></div>
        <div className="form-box">
          <form ref={formRef} onSubmit={handleSubmit(_onSubmit)}>
            <div className="fields-box">
              <Input.Wrapper data-field-fade>
                <Input.Label>
                  <RiFileAddLine size={'1.7em'} />
                  Name your project
                </Input.Label>
                <Input.Text
                  type="text"
                  name="title"
                  placeholder="Give your project a descriptive title"
                  ref={register({
                    required: 'Project title is required.'
                  })}
                />
                <Input.Error>{errors?.title?.message}</Input.Error>
              </Input.Wrapper>
              <Input.Wrapper data-field-fade>
                <Input.Label>
                  <RiShareForwardLine size={'1.7em'} />
                  Invite your friends
                </Input.Label>
                <Input.Select
                  name="contacts"
                  placeholder="Add people by name or email"
                  control={control}
                  options={user.contacts}
                  getOptionLabel={option => {
                    return option.role === Role.GUEST
                      ? option.email
                      : `${option.name} (${option.email})`;
                  }}
                  getOptionValue={option => option._id}
                  getNewOptionData={email => ({
                    _id: email,
                    email,
                    role: Role.GUEST,
                    label: email,
                    value: email,
                    __isNew__: true
                  })}
                  menuPortalTarget={document.body}
                  checkValid={data => isEmail(data.email)}
                />
                <Input.Error>{errors?.contacts?.message}</Input.Error>
              </Input.Wrapper>
              <Input.Error>{errors?.general?.message}</Input.Error>
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
