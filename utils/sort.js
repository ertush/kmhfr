export function sortOptions (sortObj) {
    const obj = {}
    // const arr = []
  

    const sortedEntries = Object.entries(sortObj).sort((a, b) => {
        if(a[0] > b[0]) return 1;
        if(a[0] < b[0]) return -1;

        return 0;

    })


    // for(let [k, v] of sortedEntries){
    //     obj[k] = v
    // }

    return sortedEntries.map(val => {
        obj[val[0]] = val[1];

        return obj
    })

}