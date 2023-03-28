/*
* @params(
    searchTerm RegExp
    userGroup String
    )

* @return (
    boolean
 ) 
*
*/

const belongsToUserGroup = (usrGroup, expectedGroup) => expectedGroup.match(usrGroup) !== null


export {
    belongsToUserGroup,
}