# Restrofox Offline POS

A modern, offline-first Point of Sale (POS) system built with Electron, designed specifically for restaurants and food service businesses. Restrofox provides a seamless experience that works even when internet connectivity is unreliable.

## 🚀 Features

### Core POS Functionality
- **Order Management** - Create, modify, and track customer orders
- **Menu Management** - Easy-to-use interface for managing menu items, categories, and pricing
- **Table Management** - Track table occupancy and assign orders to specific tables
- **Payment Processing** - Support for multiple payment methods (cash, card, digital)
- **Receipt Printing** - Generate and print customer receipts
- **Split Bills** - Handle split payments and group orders

### Offline-First Design
- **Works Without Internet** - Full functionality even when offline
- **Data Synchronization** - Automatic sync when connection is restored
- **Local Data Storage** - Secure local database for all transactions
- **Backup & Restore** - Easy data backup and recovery options

### Restaurant-Specific Features
- **Kitchen Display** - Send orders directly to kitchen staff
- **Inventory Tracking** - Monitor stock levels and ingredients
- **Staff Management** - User accounts with role-based permissions
- **Reporting & Analytics** - Sales reports, popular items, peak hours analysis
- **Multi-location Support** - Manage multiple restaurant locations

## 📋 System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB free space
- **Display**: 1024x768 minimum resolution
- **Network**: Optional (for sync and updates)

## 🛠️ Installation

### For End Users

1. **Download the latest release** from the [Releases](https://github.com/Rajul-DevoTrend/Restrofox-offline/releases) page
2. **Install the application**:
   - **Windows**: Run the `.exe` installer
   - **macOS**: Open the `.dmg` file and drag to Applications
   - **Linux**: Install the `.deb` or `.AppImage` file

### For Developers

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rajul-DevoTrend/Restrofox-offline.git
   cd Restrofox-offline
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Package the application**:
   ```bash
   npm run dist
   ```

## 🚦 Quick Start

1. **Launch Restrofox** from your desktop or applications folder
2. **Initial Setup**:
   - Create your restaurant profile
   - Set up menu categories and items
   - Configure payment methods
   - Add staff accounts (optional)
3. **Start Taking Orders**:
   - Select a table or create a new order
   - Add items from your menu
   - Process payment
   - Print receipt

## 📖 User Guide

### Setting Up Your Menu
1. Navigate to **Menu Management** in the admin panel
2. Create categories (Appetizers, Main Courses, Desserts, etc.)
3. Add menu items with prices, descriptions, and images
4. Set up modifiers and customization options

### Processing Orders
1. **New Order**: Click "New Order" or select an empty table
2. **Add Items**: Browse menu and click items to add to order
3. **Modify Order**: Adjust quantities, add special instructions
4. **Payment**: Select payment method and process transaction
5. **Receipt**: Print or email receipt to customer

### Managing Tables
- **Table View**: Visual representation of restaurant layout
- **Order Assignment**: Drag orders to specific tables
- **Table Status**: See occupied, available, and reserved tables
- **Merge Orders**: Combine multiple orders for large parties

## 🔧 Configuration

### Database Settings
The application uses SQLite for local data storage. Database files are stored in:
- **Windows**: `%APPDATA%/Restrofox/database/`
- **macOS**: `~/Library/Application Support/Restrofox/database/`
- **Linux**: `~/.config/Restrofox/database/`

### Printer Configuration
1. Go to **Settings > Printers**
2. Add receipt printer (thermal or standard)
3. Configure paper size and print layout
4. Test print functionality

### Backup Configuration
- **Automatic Backups**: Enabled by default (daily)
- **Manual Backup**: Export data from Settings menu
- **Restore**: Import backup files to restore data

## 🔒 Security Features

- **User Authentication** - Secure login for staff members
- **Role-Based Access** - Different permission levels (Admin, Manager, Staff)
- **Data Encryption** - Local database encryption
- **Audit Trail** - Track all transactions and system changes
- **Session Management** - Automatic logout after inactivity

## 📊 Reporting

### Available Reports
- **Daily Sales Summary** - Revenue, transactions, popular items
- **Weekly/Monthly Reports** - Trends and performance analysis
- **Inventory Reports** - Stock levels and usage patterns
- **Staff Performance** - Individual sales and productivity metrics
- **Tax Reports** - Tax collection and compliance data

### Exporting Data
- Export reports to PDF, Excel, or CSV formats
- Schedule automatic report generation
- Email reports to management

## 🔄 Data Synchronization

### Cloud Sync (Optional)
- **Multi-device Sync** - Keep data synchronized across devices
- **Real-time Updates** - Instant updates across connected terminals
- **Conflict Resolution** - Automatic handling of data conflicts
- **Offline Queue** - Store changes when offline, sync when connected

## 🛠️ Development

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Electron
- **Database**: SQLite
- **Build Tool**: Electron Builder
- **Testing**: Jest, Playwright

### Project Structure
```
my-electron-app/
├── src/
│   ├── main/           # Main Electron process
│   ├── renderer/       # Renderer process (UI)
│   ├── components/     # Reusable UI components
│   └── utils/          # Utility functions
├── assets/             # Images, icons, fonts
├── build/              # Build configuration
├── dist/               # Build output (not tracked)
├── node_modules/       # Dependencies (not tracked)
└── package.json        # Project configuration
```

### Available Scripts
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run dist        # Package application
npm run test        # Run tests
npm run lint        # Code linting
npm run format      # Format code
```

## 🐛 Troubleshooting

### Common Issues

**Application Won't Start**
- Check system requirements
- Verify all dependencies are installed
- Try running as administrator (Windows)

**Database Errors**
- Check database file permissions
- Verify storage space availability
- Try restoring from backup

**Printer Issues**
- Verify printer drivers are installed
- Check USB/network connections
- Test with other applications

**Sync Problems**
- Check internet connectivity
- Verify sync credentials
- Check firewall settings

### Getting Help
- Check the [FAQ](./docs/FAQ.md)
- Search [existing issues](https://github.com/Rajul-DevoTrend/Restrofox-offline/issues)
- Create a [new issue](https://github.com/Rajul-DevoTrend/Restrofox-offline/issues/new)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

- **Email**: support@restrofox.com
- **Documentation**: [docs.restrofox.com](https://docs.restrofox.com)
- **Issues**: [GitHub Issues](https://github.com/Rajul-DevoTrend/Restrofox-offline/issues)

## 🏆 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Icons by [Lucide](https://lucide.dev/)
- Testing framework by [Jest](https://jestjs.io/)

## 📈 Roadmap

- [ ] Mobile companion app
- [ ] Advanced analytics dashboard
- [ ] Integration with popular payment gateways
- [ ] Multi-language support
- [ ] Cloud-based menu management
- [ ] Customer loyalty program integration

---

**Restrofox Offline POS** - Making restaurant management simple, reliable, and efficient.

For the latest updates and announcements, follow us on [GitHub](https://github.com/Rajul-DevoTrend/Restrofox-offline).#   M y - D e s k t o p - a p p  
 