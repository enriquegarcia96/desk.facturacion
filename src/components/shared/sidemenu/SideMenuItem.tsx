import { NavLink } from 'react-router';

import { IMenu } from '@interface/ApiResponse';

export const SideMenuItem = ({ route, Icon, titleMenu, subTitle }: IMenu) => {
  return (
    <NavLink
      key={ route }
      to={ route }
      end
    >
      <div>
        <Icon />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-5 text-white">{ titleMenu }</span>
        <span className="text-sm text-white/50 hidden md:block">{ subTitle }</span>
      </div>
    </NavLink>
  );
}