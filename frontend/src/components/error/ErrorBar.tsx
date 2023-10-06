import CrossIcon from '../../assets/CrossIcon';
import { Colors } from '../../utils/Theme';
import { Errorheader, ErrorTypography } from './ErrorStyles';
const ErrorBar = ({ message, setOpen }: { message: string; setOpen: (value: boolean) => void }) => {
    if (message === undefined || message === '') {
        message = 'Something Went Wrong, Please Try Again';
    }
    return (
        <Errorheader>
            <ErrorTypography>{message}</ErrorTypography>
            <CrossIcon
                onClick={() => setOpen(false)}
                strokeColor={Colors.white}
                style={{
                    position: 'static',
                    marginLeft: 'auto',
                    marginRight: '1rem',
                }}
            />
        </Errorheader>
    );
};
export default ErrorBar;
