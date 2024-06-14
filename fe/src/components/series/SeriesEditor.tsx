import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import QuillEditor from '../common/QuillEditor';
import { functionChange } from '../../type';
import * as Yup from "yup";
import * as formik from 'formik';

interface Props {
  title?: string;
  body?: string;
  handleSubmit: functionChange;
}

type FieldType = {
  title: string;
  description: string;
};

const SeriesEditor: React.FC<Props> = (props) => {
  const [formLoaded, setFormLoaded] = useState(false);
  const [bodyText, setBodyText] = useState<string>(props.body || '');
  const [titleTxt, setTitleTxt] = useState<string>(props.title || '');

  const onSubmit = async (values: FieldType) => {
    console.log("values", values);
    if (values) {
      const data = {
        title: values.title,
        description: values.description,
      }
      props.handleSubmit(data);
    }
  }

  const { Formik } = formik;

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Vui lòng tiêu đề series"),
  });

  useEffect(() => {
    const keys = Object.keys(props);
    const isAllKeysLoaded = keys.every((props: any, key) => props[key] !== undefined);
    if (props.body) {
      setBodyText(props.body);
    }

    if (props.title) {
      setTitleTxt(props.title);
    }

    if (isAllKeysLoaded) {
      setFormLoaded(true);
    }
  }, [props]);

  console.log("props", props);

  if (!formLoaded) {
    return null;
  }

  return (
    <>
      {formLoaded &&
        <Formik
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          initialValues={{
            title: titleTxt,
            description: bodyText
          }}
        >
          {({ handleSubmit, handleChange, values, touched, errors }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label><span className='required-label'>*</span>Tiêu đề</Form.Label>
                <Form.Control
                  size='lg'
                  type="text"
                  name="title"
                  placeholder="Nhập tiêu đề"
                  value={values.title}
                  onChange={handleChange}
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="formBody">
                <Form.Label>Nội dung</Form.Label>
                <Form.Control
                  type="hidden"
                  name="description"
                  value={values.description}
                />
                <QuillEditor name="description" data={values.description} onDataChange={(data) => handleChange({ target: { name: 'description', value: data } })} />
              </Form.Group>
              <Button type='submit'>
                Lưu Series
              </Button>
            </Form>
          )}
        </Formik>}
    </>
  );
};

export default SeriesEditor;
