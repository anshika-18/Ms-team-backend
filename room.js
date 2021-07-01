const {v4}=require('uuid')

class Room {
    participants=[]
    roomId=null
    author=null

    constructor(author)
    {
        this.roomId=v4();
        this.author=author
    }

    //add a participant
    addParticipants=(participant)=>{
        this.participants.push(participant)
    }

    removeParticipants=(participantId)=>{
        console.log('remove')
        let i=this.participants.findIndex(
            (existingParticipantId)=>existingParticipantId.id===participantId
        )
        if(i>-1)
        {
            this.participants.splice(i,1)
            //console.log(this.participants)
        }
    }

    getInfo = () => ({
        participants: this.participants,
        roomId: this.roomId,
        author: this.author
    })
}

module.exports=Room;
