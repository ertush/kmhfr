import { SettingsInputHdmiSharp } from '@mui/icons-material';
import {Field} from 'formik'
import { forwardRef, useState, useEffect, useRef } from 'react'


const SelectSearch = forwardRef(function Select(props, ref) {

    const [options, setOptions] = useState([])
    const [hidden, setHidden] = useState(true)

    const text = useRef(null)

    useEffect(() => {
    //    const field = document.getElementById('searchable_select')
    setOptions([...props.options])

    }, [])  

    useEffect(() => {
        if(text.current){
     
        setOptions(prev => {
            return prev.filter(({label}) => label.includes(text.current))
        })

        text.current = ""
    }
    }, [hidden])

    

    return (
        <div class="w-full">
            {
            hidden &&
            <Field 
            type="text"
            name="facility_subcounty"
            className="flex-none w-full bg-transparent  p-2 flex-grow border placeholder-gray-500 border-blue-600 focus:shadow-none focus:bg-white focus:border-black outline-none"
            
            onChange={e => {
                
                setHidden(false)
                text.current = e.target.value
            }}/>
        }
        {
            !hidden &&
        <Field
          innerRef={ref}
          as="select"
          id="searchable_select"
          onChange = {
            () => setHidden(true)
          }
         
          {...props}
          className='flex-none w-full p-2 border border-blue-600 bg-transparent flex-grow  placeholder-gray-200  focus:border-black outline-none'>
         
          {
            ((_options) => _options.map(({ value, label }, i) =>
              <option className={`py-1 hover:bg-red-300 text-normal font-normal ${i == 0 ? 'text-gray-300' : ''}`} key={i} value={value}>{label}</option>
            ))(props.options?.length ? options : [])
          }
        </Field>
        }   
        </div>
    )
});

export default SelectSearch