export const errorParseInterceptor = (error) => {
    console.log('e',error);

    console.log(JSON.stringify(error));

    if (error?.response?.data) {

        const {
            status,
            statusText,
            message,
            details,
        } = error.response.data

        return {
            status,
            details,
            statusText,
            message
        }
    }

    return {
        status: '',
        statusText: 'Unexpected Error',
        message: error.message
    }
}
