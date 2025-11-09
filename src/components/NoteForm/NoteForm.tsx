import { Formik, Form, Field, ErrorMessage as FormikError } from 'formik';
import * as Yup from 'yup';
import css from './NoteForm.module.css';
import type { NoteTag } from '../../types/note';

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag | '';
}

interface NoteFormProps {
  onSubmit: (values: { title: string; content: string; tag: NoteTag }) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Min 3 symbols')
    .max(50, 'Max 50 symbols')
    .required('Title is required'),
  content: Yup.string().max(500, 'Max 500 symbols'),
  tag: Yup.mixed<NoteTag>()
    .oneOf(
      ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'],
      'Invalid tag',
    )
    .required('Tag is required'),
});

const initialValues: NoteFormValues = {
  title: '',
  content: '',
  tag: '',
};

export default function NoteForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: NoteFormProps) {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, helpers) => {
        const { title, content, tag } = values;
        onSubmit({ title, content, tag: tag as NoteTag });
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting: formSubmitting }) => {
        const disabled = isSubmitting ?? formSubmitting;

        return (
          <Form className={css.form}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <Field
                id="title"
                name="title"
                type="text"
                className={css.input}
              />
              <FormikError
                name="title"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <Field
                as="textarea"
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
              />
              <FormikError
                name="content"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <Field
                as="select"
                id="tag"
                name="tag"
                className={css.select}
              >
                <option value="">Select tag</option>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <FormikError
                name="tag"
                component="span"
                className={css.error}
              />
            </div>

            <div className={css.actions}>
              <button
                type="button"
                className={css.cancelButton}
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={disabled}
              >
                Create note
              </button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
