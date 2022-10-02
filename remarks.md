Test should not check the full error message if it's a validation issue.

Routes should follow CQS. So, routes should not return values when inserting into the DB.
And should really not modify or add fields to the object in the response in any way...

Creation routes should be idempotent. So, no 409 conflict, but 201 success instead if the object is already in the DB.
Using something akin to UUIDs would be nice too :
 - Sequential Ids can be dangerous, might as well stop using them.
 - with UUIDs, no need to call the backend to have a valid identifier
 - with UUIDs, basically no risk of a conflict if multiple request are made at the same time.
 - with UUIDs, easier to implement indempotence.


I guess that's personnal, but i prefer cursor based pagination (prev/next) in the body / query / params.
Content-Range feels weird to use for something else than bytes, and without 206/416.
https://datatracker.ietf.org/doc/html/rfc7233#section-4.2
But that might be me.
