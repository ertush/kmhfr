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

const hasUserGroupId = (groupId, expectedGroupId) => groupId == expectedGroupId


export {
    belongsToUserGroup,
    hasUserGroupId
}