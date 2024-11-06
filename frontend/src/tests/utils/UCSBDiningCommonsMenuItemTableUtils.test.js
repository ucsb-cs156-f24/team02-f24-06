import { onDeleteSuccess } from 'main/utils/UCSBDiningCommonsMenuItemUtils';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: jest.fn(),
}));

describe('onDeleteSuccess', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('calls console.log and toast with the message', () => {
    const message = 'Item deleted successfully';

    onDeleteSuccess(message);

    expect(console.log).toHaveBeenCalledWith(message);
    expect(toast).toHaveBeenCalledWith(message);
  });
});