//
//  WelcomeView.swift
//  KitchIN
//
//  Created by Joshua Lim on 10/12/23.
//

import SwiftUI
import Alamofire

struct WelcomeView: View {
    
    @State var email: String = ""
    @State var password: String = ""
    @State private var isLoading = false
    
    var body: some View {
        
        NavigationStack {
            
            GeometryReader { bounds in
                
                ZStack {
                    
                    VStack {
                        
                        // App Title & Subtitle
                        VStack {
                            
                            Text("KitchIN")
                                .font(.custom("AROneSans-Bold", size: 50))
                                .foregroundStyle(Color("Primary"))
                            
                            Text("Your Kitchen. Your way.")
                                .font(.custom("AROneSans-SemiBold", size: 17))
                                .foregroundStyle(Color("Primary"))
                            
                        }.padding(.vertical, 30)
                        
                        // Email Title
                        HStack{
                            
                            Text("Email")
                                .font(.custom("AROneSans-SemiBold", size: 17))
                                .foregroundStyle(.primary)
                                .padding(.leading, 15)
                            
                            Spacer()
                            
                        }.padding(.bottom, 1)
                        
                        // Email Address Field
                        TextField("Email", text: $email)
                            .font(.custom("AROneSans-SemiBold", size: 15))
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .padding()
                            .frame(height: 50)
                            .background(Color("Foreground"))
                            .cornerRadius(15)
                            .shadow(radius: 3, y: 3)
                            .padding(.bottom, 8)
                        
                        // Password Title
                        HStack{
                            
                            Text("Password")
                                .font(.custom("AROneSans-SemiBold", size: 17))
                                .foregroundStyle(.primary)
                                .padding(.leading, 15)
                            
                            Spacer()
                            
                        }.padding(.bottom, 1)
                        
                        // Secure Password Field
                        SecureField("Password", text: $password)
                            .font(.custom("AROneSans-SemiBold", size: 15))
                            .textContentType(.password)
                            .keyboardType(.default)
                            .padding()
                            .frame(height: 50)
                            .background(Color("Foreground"))
                            .cornerRadius(15)
                            .shadow(radius: 3, y: 3)
                        
                        // Vertical Spacing
                        Spacer()
                        
                        // Continue Button
                        Button {
                            
                            self.onboard()
                            
                        } label: {
                            
                            Text("Continue".uppercased())
                                .font(.custom("AROneSans-Bold", size: 17))
                                .foregroundStyle(.white)
                                .frame(width: bounds.size.width - 40, height: 50)
                                .background(Color("Primary"))
                                .cornerRadius(15)
                            
                        }.buttonStyle(.plain)
                            .opacity((email.isEmpty || password.isEmpty) ? 0.75 : 1.0)
                            .disabled(email.isEmpty || password.isEmpty)
                        
                    }.padding(20)
                        .background(Color("Background"))
                 
                    // Loading Overlay
                    LoaderView(isLoading: isLoading)
                    
                }
                
            }
            
        }
        
    }
    
    // Private Functions
    private func onboard() {
        
        // Set Loading
        self.isLoading = true
        
        // Headers
        let headers: HTTPHeaders = []
        
        // Parameters
        let params: Parameters = [:]
        
        // Request
        AF.request("https://www.kitchin.com/api/v1/release/account/auth", method: .post, parameters: params, headers: headers).validate(statusCode: statusCodes).responseData() { response in
            
            print("Response: \(String(data: response.data!, encoding: .utf8))")
            
        }
            
//        .responseDecodable(of: Account.self) { response in
//            
//            // Stop Loading
//            self.isLoading = false
//
//        }
        
    }
    
}

#Preview {
    WelcomeView()
}
