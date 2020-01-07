import createMockStore from "../_config/mockStore.config";
import notesActions from "../_actions/notes.actions";
import testConstants from "../_constants/test.constants";

const {
  notes: { note, newNote, updateNote },
  projects: { project }
} = testConstants;

describe("Note Actions", () => {
  let store;
  beforeAll(() => {
    store = createMockStore();
  });
  afterEach(() => {
    store.clearActions();
  });
  it("it should GET notes by project", async () => {
    await store.dispatch(notesActions.getNotesByProject(project._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should GET notes", async () => {
    await store.dispatch(notesActions.getNotes());
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should GET a note", async () => {
    await store.dispatch(notesActions.getNote(note._id));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should CREATE a note", async () => {
    await store.dispatch(notesActions.createNote(newNote));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should UPDATE a note", async () => {
    await store.dispatch(notesActions.updateNote(note._id, updateNote));
    expect(store.getActions()).toMatchSnapshot();
  });
  it("it should DELETE a note", async () => {
    await store.dispatch(notesActions.deleteNote(note._id));
    expect(store.getActions()).toMatchSnapshot();
  });
});
