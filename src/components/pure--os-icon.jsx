import DebianLogo from '../assets/os-icons/cib-debian.svg';
import AppleLogo from '../assets/os-icons/cib-apple.svg';
import ArchLogo from '../assets/os-icons/cib-arch-linux.svg';
import CentOSLogo from '../assets/os-icons/cib-centos.svg';
import FedoraLogo from '../assets/os-icons/cib-fedora.svg';
import GentooLogo from '../assets/os-icons/cib-gentoo.svg';
import OpenSUSELogo from '../assets/os-icons/cib-opensuse.svg';
import RedhatLogo from '../assets/os-icons/cib-redhat.svg';
import UbuntuLogo from '../assets/os-icons/cib-ubuntu.svg';
import WindowsLogo from '../assets/os-icons/cib-windows.svg';

import DefaultLogo from '../assets/os-icons/cib-linux.svg';

export default function PureOperatingOs(props) {
    const osIconPathMap = {
        "apple": AppleLogo,
        "arch-linux": ArchLogo,
        "centos": CentOSLogo,
        "debian": DebianLogo,
        "fedora": FedoraLogo,
        "gentoo": GentooLogo,
        "opensuse": OpenSUSELogo,
        "redhat": RedhatLogo,
        "ubuntu": UbuntuLogo,
        "windows": WindowsLogo
    }

    return (
        <i><img src={props.os && typeof props.os === "string" ? osIconPathMap[props.os.toLowerCase()] : DefaultLogo} alt={props.os} width="14" height="14" /></i>
    )
}