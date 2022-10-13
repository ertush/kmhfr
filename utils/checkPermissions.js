/*
* @params(
    searchTerm RegExp
    permissions Array<Strings>
    )

* @return (
    boolean
 ) 
*
*/

const hasUsersPermission = (searchTerm, permissions) => {

    const found = permissions ? permissions.filter(permission => permission.match(searchTerm) !== null) : []

    // console.log({found})
    return found.length > 0
}


const hasSystemSetupPermissions = (searchTerm, permissions) => {

    const found = permissions ? permissions.filter(permission => permission.match(searchTerm) !== null) : []

    // console.log({found})
    return found.length > 0
}

const hasAdminOfficesPermissions = (searchTerm, permissions) => {

    const found = permissions ? permissions.filter(permission => permission.match(searchTerm) !== null) : []

    // console.log({found})
    return found.length > 0
}


export {
    hasUsersPermission,
    hasSystemSetupPermissions,
    hasAdminOfficesPermissions
}