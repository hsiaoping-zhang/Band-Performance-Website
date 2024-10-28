package enum

type ResponseCode int

const (
	Success ResponseCode = 200

	// User
	QueryError        ResponseCode = 410
	PermissionInvalid ResponseCode = 411

	// Server
	DBError   ResponseCode = 511
	NoData    ResponseCode = 512
	AuthError ResponseCode = 513
)
