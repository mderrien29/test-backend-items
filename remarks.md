Test should not check the full error message if it's a validation issue.

Routes should follow CQS (Command Query Separation).

Creation routes should be idempotent. So, no 409 conflict, but 201 success instead.
