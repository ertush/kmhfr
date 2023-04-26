// This functional component handles print functionality
// It accepts a url and name of the document as props

import {IconButton } from '@material-ui/core';
import {FcDocument} from 'react-icons/fc';


const UrlPrinter=(props)=>{

    // JS function that accepts a url as input and print to pdf
    
    const handlePrint = (fetchUrl) => () => {
        fetch(fetchUrl)
      .then(response => response.text())
      .then(data => {
        // Create a new window with the fetched data
        var printWindow = window.open('', 'Print Window', 'height=400,width=600');
        printWindow.document.write(data);
        printWindow.document.close();
        
        // Wait for the window to finish loading before triggering printing
        printWindow.addEventListener('load', function() {
          printWindow.print();
        });
      });
      };
 console.log("url to print"+props.url_to_print);

      return(
        // An icon button that when clicked prompts print/Save as pdf funtionality
            <IconButton onClick={handlePrint(props.url_to_print)}><FcDocument/>{props.name}</IconButton>

      );

}
export default UrlPrinter;