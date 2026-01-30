import 'package:flutter/material.dart';

// =============================================================================
// CREATE ACCOUNT SCREEN
// =============================================================================
// Registration form (name, email, phone, password, terms). Validates and
// submits; wire to auth service when backend is ready.
// =============================================================================

class CreateAccountScreen extends StatefulWidget {
  const CreateAccountScreen({super.key});

  @override
  State<CreateAccountScreen> createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends State<CreateAccountScreen> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  bool _passwordVisible = false;
  bool _confirmPasswordVisible = false;
  bool _termsAccepted = false;

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _createAccount() {
    if (_formKey.currentState!.validate()) {
      if (!_termsAccepted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Please accept the Terms of Service and Privacy Policy'),
            backgroundColor: Colors.red,
          ),
        );
        return;
      }
      
      // TODO: Handle account creation (connect to backend later)
      // Show success message
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Account created successfully!'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final textTheme = theme.textTheme;
    return Scaffold(
      backgroundColor: colorScheme.surface,
      appBar: AppBar(
        backgroundColor: colorScheme.surface,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back, color: colorScheme.onSurface),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Create Account',
          style: textTheme.headlineLarge?.copyWith(color: colorScheme.onSurface),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Heading
                Text(
                  'Join CareConnect',
                  style: textTheme.displayMedium?.copyWith(
                    color: colorScheme.onSurface,
                  ),
                ),
                
                SizedBox(height: 8),
                
                Text(
                  'Create your account to get started',
                  style: textTheme.bodyLarge?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
                
                SizedBox(height: 32),
                
                // First Name and Last Name Row
                Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'First Name',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                          SizedBox(height: 8),
                          TextFormField(
                            controller: _firstNameController,
                            decoration: InputDecoration(
                              hintText: 'John',
                              hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                              filled: true,
                              fillColor: colorScheme.surfaceContainer,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.outline),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.outline),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.primary, width: 2),
                              ),
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Required';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Last Name',
                            style: textTheme.headlineSmall?.copyWith(
                              color: colorScheme.onSurface,
                            ),
                          ),
                          SizedBox(height: 8),
                          TextFormField(
                            controller: _lastNameController,
                            decoration: InputDecoration(
                              hintText: 'Doe',
                              hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                              filled: true,
                              fillColor: colorScheme.surfaceContainer,
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.outline),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.outline),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(12),
                                borderSide: BorderSide(color: colorScheme.primary, width: 2),
                              ),
                              contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Required';
                              }
                              return null;
                            },
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                
                SizedBox(height: 24),
                
                // Email Address
                Text(
                  'Email Address',
                  style: textTheme.headlineSmall?.copyWith(
                    color: colorScheme.onSurface,
                  ),
                ),
                SizedBox(height: 8),
                TextFormField(
                  controller: _emailController,
                  keyboardType: TextInputType.emailAddress,
                  decoration: InputDecoration(
                    hintText: 'your.email@example.com',
                    hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                    filled: true,
                    fillColor: colorScheme.surfaceContainer,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.primary, width: 2),
                    ),
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Email is required';
                    }
                    if (!value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                
                SizedBox(height: 24),
                
                // Phone Number
                Text(
                  'Phone Number',
                  style: textTheme.headlineSmall?.copyWith(
                    color: colorScheme.onSurface,
                  ),
                ),
                SizedBox(height: 8),
                TextFormField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: InputDecoration(
                    hintText: '(555) 123-4567',
                    hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                    filled: true,
                    fillColor: colorScheme.surfaceContainer,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.primary, width: 2),
                    ),
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Phone number is required';
                    }
                    return null;
                  },
                ),
                
                SizedBox(height: 24),
                
                // Password
                Text(
                  'Password',
                  style: textTheme.headlineSmall?.copyWith(
                    color: colorScheme.onSurface,
                  ),
                ),
                SizedBox(height: 8),
                TextFormField(
                  controller: _passwordController,
                  obscureText: !_passwordVisible,
                  decoration: InputDecoration(
                    hintText: 'Create a strong password',
                    hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                    filled: true,
                    fillColor: colorScheme.surfaceContainer,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.primary, width: 2),
                    ),
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _passwordVisible ? Icons.visibility : Icons.visibility_off,
                        color: colorScheme.onSurfaceVariant,
                      ),
                      onPressed: () {
                        setState(() {
                          _passwordVisible = !_passwordVisible;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Password is required';
                    }
                    if (value.length < 8) {
                      return 'Password must be at least 8 characters';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 8),
                Text(
                  'At least 8 characters with letters and numbers',
                  style: textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurfaceVariant,
                  ),
                ),
                
                SizedBox(height: 24),
                
                // Confirm Password
                Text(
                  'Confirm Password',
                  style: textTheme.headlineSmall?.copyWith(
                    color: colorScheme.onSurface,
                  ),
                ),
                SizedBox(height: 8),
                TextFormField(
                  controller: _confirmPasswordController,
                  obscureText: !_confirmPasswordVisible,
                  decoration: InputDecoration(
                    hintText: 'Re-enter your password',
                    hintStyle: textTheme.bodySmall?.copyWith(color: colorScheme.onSurfaceVariant),
                    filled: true,
                    fillColor: colorScheme.surfaceContainer,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.outline),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: colorScheme.primary, width: 2),
                    ),
                    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _confirmPasswordVisible ? Icons.visibility : Icons.visibility_off,
                        color: colorScheme.onSurfaceVariant,
                      ),
                      onPressed: () {
                        setState(() {
                          _confirmPasswordVisible = !_confirmPasswordVisible;
                        });
                      },
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please confirm your password';
                    }
                    if (value != _passwordController.text) {
                      return 'Passwords do not match';
                    }
                    return null;
                  },
                ),
                
                SizedBox(height: 24),
                
                // Terms of Service Checkbox
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: colorScheme.inversePrimary,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: colorScheme.outline),
                  ),
                  child: Row(
                    children: [
                      Checkbox(
                        value: _termsAccepted,
                        onChanged: (value) {
                          setState(() {
                            _termsAccepted = value ?? false;
                          });
                        },
                        activeColor: colorScheme.primary,
                      ),
                      Expanded(
                        child: RichText(
                          text: TextSpan(
                            style: textTheme.bodySmall?.copyWith(color: colorScheme.onSurface),
                            children: [
                              const TextSpan(text: 'I agree to the '),
                              TextSpan(
                                text: 'Terms of Service',
                                style: textTheme.labelMedium?.copyWith(
                                  color: colorScheme.primary,
                                ),
                              ),
                              const TextSpan(text: ' and '),
                              TextSpan(
                                text: 'Privacy Policy',
                                style: textTheme.labelMedium?.copyWith(
                                  color: colorScheme.primary,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                
                SizedBox(height: 32),
                
                // Create Account Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: _createAccount,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: colorScheme.primary,
                      foregroundColor: colorScheme.onPrimary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: Text(
                      'Create Account',
                      style: textTheme.headlineMedium?.copyWith(
                        color: colorScheme.onPrimary,
                      ),
                    ),
                  ),
                ),
                
                SizedBox(height: 24),
                
                // Sign In Link
                Center(
                  child: RichText(
                    text: TextSpan(
                      style: textTheme.bodyLarge?.copyWith(color: colorScheme.onSurfaceVariant),
                      children: [
                        const TextSpan(text: 'Already have an account? '),
                        TextSpan(
                          text: 'Sign In',
                          style: textTheme.headlineSmall?.copyWith(
                            color: colorScheme.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                SizedBox(height: 24),
              ],
            ),
          ),
        ),
      ),
    );
  }
}