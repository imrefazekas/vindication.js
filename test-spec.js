let obj = {
	uid: '17eb608274195f86',
	operationUID: '17d91ba60343c224',
	contractUID: undefined,
	reference: undefined,
	account: '17fa5dad0bce9729',
	ledger: '3812',
	asset: '172b3949422a5d2b',
	value: 0.11,
	side: 'Debit',
	date: {
		createdAt: 1587393079438,
		recordingDate: 1587393078104,
		valueDate: 1587393078104,
		effectiveDate: 1587393078104
	},
	classification: {
		contractType: 'Loan',
		contractSubype: 'Disburse',
		contractMethod: '+',
		operationType: 'Fee_Transaction',
		operationSubtype: 'Processing',
		operationMethod: 'Book'
	},
	message: undefined,
	source: undefined,
	end: undefined,
	origin: undefined,
	timestamp: 1587393079592
}
let spec = {
	uid: {
		required: true
	},
	operationUID: {
		required: true
	},
	contractUID: {
		required: true
	},
	reference: {
		required: false
	},
	account: {
		required: true
	},
	ledger: {
		required: false
	},
	asset: {
		required: true
	},
	value: {
		required: true
	},
	side: {
		required: true
	},
	date: {
		required: true
	},
	classification: {
		required: true
	},
	message: {
		required: false
	},
	source: {
		required: false
	},
	end: {
		required: false
	},
	origin: {
		required: false
	},
	timestamp: {
		required: true
	}
}

var f = require('./vindication')
console.log( f.validate( obj, spec ) )
