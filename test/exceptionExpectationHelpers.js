const errorString = "VM Exception while processing transaction: ";

async function tryCatch(promise, reason) {
    try {
        await promise;
        throw null;
    }
    catch (error) {
        assert(error, "Expected a VM exception but did not get one");
        assert(error.message.search(errorString + reason) >= 0, "Expected an error containing '" + errorString + reason + "' but got '" + error.message + "' instead");
    }
};

module.exports = {
    assertRevertError : async function(promise) { await tryCatch(promise, "revert"); },
    assertOutOfGasError : async function(promise) { await tryCatch(promise, "out of gas"); },
    assertInvalidJumpError : async function(promise) { await tryCatch(promise, "invalid JUMP"); },
    assertInvalidOpcodeError : async function(promise) { await tryCatch(promise, "invalid opcode"); },
    assertStackOverflowError : async function(promise) { await tryCatch(promise, "stack overflow"); },
    assertStackUnderflowError : async function(promise) { await tryCatch(promise, "stack underflow"); },
    assertStaticStateChangeError : async function(promise) { await tryCatch(promise, "static state change"); },
};
