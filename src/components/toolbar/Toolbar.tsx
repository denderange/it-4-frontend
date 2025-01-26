import { LockOpen, Trash2, Lock } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ToolbarProps {
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  onFilterChange: (value: string) => void;
}

const Toolbar = ({
  onBlock,
  onUnblock,
  onDelete,
  onFilterChange,
}: ToolbarProps) => {
  return (
    <>
      <div className="row text-bg-light py-2">
        <div className="col-8 d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm d-flex align-items-center"
            onClick={onBlock}
            data-tooltip-id="btnBlock"
            data-tooltip-content="Block selected users"
            data-tooltip-place="bottom"
          >
            <Lock />
            <span className="px-2 fw-bold">Block</span>
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={onUnblock}
            data-tooltip-id="btnUnblock"
            data-tooltip-content="Unblock selected users"
            data-tooltip-place="bottom"
          >
            <LockOpen />
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={onDelete}
            data-tooltip-id="btnDelete"
            data-tooltip-content="Delete selected users"
            data-tooltip-place="bottom"
          >
            <Trash2 />
          </button>
        </div>
        <div className="col-4">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="usr"
              placeholder="Filter"
              onChange={(e) => onFilterChange(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Tooltip id="btnBlock" />
      <Tooltip id="btnUnblock" />
      <Tooltip id="btnDelete" />
    </>
  );
};

export default Toolbar;
