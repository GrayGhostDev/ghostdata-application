import React from "react";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill, RiBankLine } from "react-icons/ri";
import { MdAccountBalanceWallet } from "react-icons/md";
import { IconBaseProps } from "react-icons"; // Import for type safety

// Interface for ServiceCard Props
interface ServiceCardProps {
  color: string;
  title: string;
  icon: React.ReactElement<IconBaseProps>; // Explicitly type the icon prop
  subtitle: string;
}

// ServiceCard Component
const ServiceCard: React.FC<ServiceCardProps> = ({
  color,
  title,
  icon,
  subtitle,
}) => (
  <div className="flex flex-row items-start white-glassmorphism p-3 m-2 cursor-pointer hover:shadow-xl transition-shadow duration-300">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <div className="ml-5">
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-1 text-white text-sm">{subtitle}</p>
    </div>
  </div>
);

// Services Component
const Services: React.FC = () => {
  return (
    <section
      className="w-full gradient-bg-services"
      aria-label="Comprehensive Web3 Services"
    >
      <div className="container mx-auto py-12 px-4 md:py-20 md:px-20 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="flex-1 mb-8 md:mb-0">
          <h1 className="text-3xl sm:text-5xl text-white text-gradient font-bold leading-tight">
            Comprehensive Web3 Services
            <br />
            Empower Your Transactions
          </h1>
          <p className="mt-4 text-base font-light text-white md:w-9/12">
            Connect, transact, and innovate with our platform integrations for
            Thirdweb and LoanDisk.
          </p>
        </div>

        {/* Service Cards */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <ServiceCard
            color="bg-[#2952E3]"
            title="Secure Wallet Connection"
            icon={
              <MdAccountBalanceWallet fontSize={21} className="text-white" />
            }
            subtitle="Connect seamlessly to blockchain wallets using Thirdweb SDK."
          />
          <ServiceCard
            color="bg-[#8945F8]"
            title="Loan and Saving Transactions"
            icon={<RiBankLine fontSize={21} className="text-white" />}
            subtitle="Access and manage your financial data from LoanDisk efficiently."
          />
          <ServiceCard
            color="bg-[#F84550]"
            title="Asset Tokenization"
            icon={<BiSearchAlt fontSize={21} className="text-white" />}
            subtitle="Tokenize real-world assets quickly and securely on the blockchain."
          />
          <ServiceCard
            color="bg-green-500"
            title="Fastest Blockchain Interactions"
            icon={<RiHeart2Fill fontSize={21} className="text-white" />}
            subtitle="Enjoy quick, reliable blockchain transactions with optimized smart contract interactions."
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
