
export const cardReducer = (state:any, action:any) => {

    switch (action.type) {
        case "ADD_TO_VOTE":{
            return {
                
                listItems: [action.payload]
            }
        }
    
        default:
            return state
    }


}