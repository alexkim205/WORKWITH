import createMockStore from '../_config/mockStore.config';
import {
  getNotesByProject,
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} from '../_actions/notes.actions';
import testConstants from '../_constants/test.constants';

const {
  notes: { note, newNote, newUpdateNote },
  projects: { project }
} = testConstants;

describe('Note Actions', () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it('it should GET notes by project', async () => {
    await store.dispatch(getNotesByProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should GET notes', async () => {
    await store.dispatch(getNotes());
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should GET a note', async () => {
    await store.dispatch(getNote(note._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should CREATE a note', async () => {
    await store.dispatch(createNote(newNote));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should UPDATE a note', async () => {
    await store.dispatch(updateNote(note._id, newUpdateNote));
    expect(store.getActions()).toMatchSnapshot();
  });
  it('it should DELETE a note', async () => {
    await store.dispatch(deleteNote(note._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
