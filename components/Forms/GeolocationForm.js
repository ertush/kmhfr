import {useContext} from 'react';
import {Formik, Field, Form} from 'formik'
import { FormContext } from './Form';

export function GeolocationForm() {
  const setFormId = useContext(FormContext);

    return (
        <Formik initialValues={{
            class:'',
            book:''
        }}
        onSubmit={(values) => {
            setFormId(prev => (prev + 1))
        }}
        >
            <Form className='w-full h-auto'>
                <Field type="text" name="class" className='w-full'/>

                <Field type="text" name="book" className='w-full'/>
                
                <button type="submit">Facility Contacts</button>
                <button onClick={() => {setFormId(prev => (prev - 1))}}>Previous</button>
                
            </Form>   
        </Formik>
    )
}