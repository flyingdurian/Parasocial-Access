/* Gate admission economy: one numbered admission ticket per incoming attendee.
   A successful physical crossing consumes one ticket exactly once. */
export function issueVenueTicket(person,id){
 if(!person||person.ticket)return person?.ticket||null;
 person.ticket=Object.seal({id:`DGG-${String(id).padStart(4,'0')}`,remaining:1,consumedAt:null});
 return person.ticket;
}
export const hasVenueTicket=person=>Number.isFinite(person?.ticket?.remaining)&&person.ticket.remaining>=1;
export function processVenueTicket(person,clerk,elapsed=0){
 if(!hasVenueTicket(person)||person.ticket.consumedAt!==null)return false;
 person.ticket.remaining-=1;
 person.ticket.consumedAt=elapsed;
 person.gatePasses=(person.gatePasses||0)+1;
 if(clerk){clerk.processed=(clerk.processed||0)+1;clerk.lastTicket=person.ticket.id;clerk.lastScanAt=elapsed;}
 return true;
}
